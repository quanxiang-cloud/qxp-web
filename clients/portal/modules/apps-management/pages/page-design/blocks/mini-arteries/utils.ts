import React from 'react';
import { useQuery } from 'react-query';

import httpClient from '@lib/http-client';
import { getBatchGlobalConfig, GetParams, setBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON, uuid } from '@lib/utils';
import { MiniArtery } from './types';
import toast from '@lib/toast';
import { Node } from '@one-for-all/artery';

const MINI_ARTERY_KEY_PREFIX = 'mini-artery';
const MINI_ARTERY_VERSION = '1.0.0';

function queryMiniArteries(): Promise<MiniArtery[]> {
  return httpClient('/api/v1/persona/dataset/m/search/key', { key: MINI_ARTERY_KEY_PREFIX })
    .then((miniArteryKeyPairs) => getBatchGlobalConfig(miniArteryKeyPairs as GetParams[]))
    .then(({ result }) => {
      return Object.entries(result)
        .map<MiniArtery | undefined>(([key, value]) => {
          const { name, node } = parseJSON<Partial<MiniArtery>>(value, {});
          if (!name || !node) {
            return;
          }

          return { key, name, node };
        })
        .filter((n): n is MiniArtery => !!n)
        .sort((miniArteryA, miniArteryB) => {
          const timestampA = miniArteryA.key.split(':')[1];
          const timestampB = miniArteryB.key.split(':')[1];

          return timestampA < timestampB ? 1 : -1;
        });
    });
}

export function useMiniArteries(): { miniArteries: MiniArtery[]; refetch: () => void } {
  const { data, refetch, isLoading } = useQuery('mini-arteries', queryMiniArteries);

  if (isLoading || !data) {
    return { miniArteries: [], refetch };
  }

  return { miniArteries: data, refetch };
}

export function deleteMiniArtery(key: string): Promise<void> {
  return httpClient('/api/v1/persona/dataset/m/bulk/delete', { key });
}

export function updateMiniArtery(miniArtery: MiniArtery): Promise<void> {
  return setBatchGlobalConfig([
    {
      key: miniArtery.key,
      version: MINI_ARTERY_VERSION,
      value: JSON.stringify({ name: miniArtery.name, node: miniArtery.node }),
    },
  ])
    .then(() => undefined)
    .catch(() => {
      toast.error('更新区块模版失败');
      return;
    });
}

export const ActiveNodeCtx = React.createContext<Node | undefined>(undefined);

export function addMiniArtery(name: string, node: Node): Promise<void> {
  return setBatchGlobalConfig([
    {
      key: `${MINI_ARTERY_KEY_PREFIX}:${new Date().toISOString()}:${uuid()}`,
      version: MINI_ARTERY_VERSION,
      value: JSON.stringify({ name, node }),
    },
  ])
    .then(() => undefined)
    .catch(() => {
      toast.error('新建区块模版失败');
      return;
    });
}
