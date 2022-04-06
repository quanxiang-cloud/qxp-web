import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import ArterySpec from '@one-for-all/artery';

import { parseJSON } from '@lib/utils';
import { getBatchGlobalConfig } from '@lib/api/user-config';

import Orchestrator from '../view-orchestration/orchestrator';
import { ROOT_NODE_ID, VERSION } from '../view-orchestration/constants';
import { genDesktopRootArteryKey } from '../view-orchestration/helpers/utils';

export type UseAppStore = {
  isLoading: boolean;
  store?: Orchestrator;
}

export default function useAppStore(): UseAppStore {
  const { appID } = useParams<{ appID: string }>();
  const rootSchema: ArterySpec.Artery = {
    node: {
      id: 'root_route_node',
      type: 'route-node',
      path: `/a/${appID}`,
      node: { id: ROOT_NODE_ID, type: 'html-element', name: 'div', children: [] },
    },
  };
  const key = genDesktopRootArteryKey(appID);
  const param = { key, version: VERSION };
  const { data: store, isLoading } = useQuery(['desktop_artery', [param]], () => {
    return getBatchGlobalConfig([param])
      .then(({ result }) => parseJSON<ArterySpec.Artery>(result[key], rootSchema)).then((appLayoutSchema) => {
        return new Orchestrator(appID, appLayoutSchema);
      });
  });

  return {
    store,
    isLoading,
  };
}

