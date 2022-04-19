import ArterySpec from '@one-for-all/artery';

import { LayoutType } from './types';
import createLayoutSchema from './helpers/create-layout-schema';
import {
  createRefSchema,
  createAppLandingRouteNode,
  genDesktopRootArteryKey,
  saveArtery,
} from './helpers/utils';
import { ROOT_NODE_ID } from './constants';

export async function initAppRootView(appID: string, layoutType: LayoutType | 'free'): FutureErrorMessage {
  const rootSchemaKey = genDesktopRootArteryKey(appID);

  const initialChild = await createAppLandingRouteNode();

  if (!initialChild) throw new Error('create initial child failed');

  if (layoutType === 'free') {
    return saveArtery(
      rootSchemaKey,
      {
        node: {
          id: 'root_route_node',
          type: 'route-node',
          path: `/a/${appID}`,
          node: {
            id: ROOT_NODE_ID,
            type: 'html-element',
            name: 'div',
            children: [initialChild],
          },
        },
      },
    );
  }

  const refSchemaKey = await createRefSchema(appID);

  if (!refSchemaKey) throw new Error('get refSchemaKey failed');

  const rootNode = createLayoutSchema({
    layoutInfo: { name: 'ROOT_LAYOUT', type: layoutType },
    refSchemaKey,
    initialChild,
    isRoot: true,
  });

  const rootSchema: ArterySpec.Artery = {
    node: {
      id: 'root_route_node',
      type: 'route-node',
      path: `/a/${appID}`,
      node: rootNode,
    },
  };

  return saveArtery(rootSchemaKey, rootSchema);
}
