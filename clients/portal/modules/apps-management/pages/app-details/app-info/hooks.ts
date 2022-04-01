import { parseJSON } from '@lib/utils';

import Orchestrator from '../view-orchestration/orchestrator';
import { ROOT_NODE_ID } from '../view-orchestration/constants';

export function useOrchestrator(appID: string, rootSchemaParse: string): Orchestrator {
  const rootSchema: SchemaSpec.Schema = {
    node: {
      id: 'root_route_node',
      type: 'route-node',
      path: `/a/${appID}`,
      node: { id: ROOT_NODE_ID, type: 'html-element', name: 'div', children: [] },
    },
  };
  return new Orchestrator(appID, parseJSON<SchemaSpec.Schema>(rootSchemaParse, rootSchema));
}
