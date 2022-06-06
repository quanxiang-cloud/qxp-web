import { useQuery } from 'react-query';
import { Artery } from '@one-for-all/artery';

import toast from '@lib/toast';
import { parseJSON } from '@lib/utils';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import { ARTERY_KEY_VERSION } from '@portal/constants';

import { getArteryKeys } from '../utils';

export function queryArtery(arteryID: string): { artery?: Artery; isLoading: boolean } {
  const { data: artery, isLoading } = useQuery(['artery', arteryID], () => {
    const arteryKeys = getArteryKeys(arteryID, true);
    return getBatchGlobalConfig(arteryKeys.map((key) => ({ key, version: ARTERY_KEY_VERSION })))
      .then(({ result }) => parseJSON<Artery | undefined>(result[arteryKeys[0]], undefined))
      .catch(() => {
        toast.error('查询页面 schema 失败');
        return undefined;
      });
  });

  return { artery, isLoading };
}
