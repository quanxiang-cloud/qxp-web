import ArterySpec from '@one-for-all/artery';

import { LayoutType } from './types';
import createLayoutSchema from './helpers/create-layout-schema';
import {
  createRefSchema,
  genDefaultArteryViewNode,
  genDesktopRootArteryKey,
  saveArtery,
} from './helpers/utils';
import { ROOT_NODE_ID } from './constants';

export async function initAppRootView(appID: string, layoutType: LayoutType | 'free'): FutureErrorMessage {
  const rootSchemaKey = genDesktopRootArteryKey(appID);

  return genDefaultArteryViewNode().then((demoViewNode) => {
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
              children: [demoViewNode],
            },
          },
        },
      );
    }

    return createRefSchema(appID).then((refSchemaKey) => {
      const rootNode = createLayoutSchema('ROOT_LAYOUT', layoutType, refSchemaKey, demoViewNode, true);
      const rootSchema: ArterySpec.Artery = {
        node: {
          id: 'root_route_node',
          type: 'route-node',
          path: `/a/${appID}`,
          node: rootNode,
        },
      };
      return saveArtery(rootSchemaKey, rootSchema);
    });
  });
}
