import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { parseJSON } from '@lib/utils';
import { getBatchGlobalConfig } from '@lib/api/user-config';

import Orchestrator from '../view-orchestration/orchestrator';
import { ROOT_NODE_ID, VERSION } from '../view-orchestration/constants';
import { genDesktopRootViewSchemaKey } from '../view-orchestration/helpers/utils';

export type UseAppStore = {
  isLoading: boolean;
  store?: Orchestrator;
}

export default function useAppStore(): UseAppStore {
  const { appID } = useParams<{ appID: string }>();
  const rootSchema: SchemaSpec.Schema = {
    node: {
      id: 'root_route_node',
      type: 'route-node',
      path: `/a/${appID}`,
      node: { id: ROOT_NODE_ID, type: 'html-element', name: 'div', children: [] },
    },
  };
  const key = genDesktopRootViewSchemaKey(appID);
  const param = { key, version: VERSION };
  const { data: store, isLoading } = useQuery(['desktop_view_schema', [param]], () => {
    return getBatchGlobalConfig([param])
      .then(({ result }) => parseJSON<SchemaSpec.Schema>(result[key], rootSchema)).then((appLayoutSchema) => {
        return new Orchestrator(appID, appLayoutSchema);
      });
  });

  return {
    store,
    isLoading,
  };
}

