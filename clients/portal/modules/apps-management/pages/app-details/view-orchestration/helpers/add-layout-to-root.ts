import { Node } from '@one-for-all/artery';
import { LayoutType } from '../types';
import createLayoutSchema from './create-layout-schema';
import { addRouteNodeToRootNode, attachToRouteNode, createRefSchema } from './utils';

type Params = {
  appID: string;
  rootNode: Node;
  layoutType: LayoutType;
  layoutName: string;
}

export default async function addLayoutToRoot(
  { appID, rootNode, layoutType, layoutName }: Params,
): Promise<Node | undefined> {
  const refSchemaKey = await createRefSchema(appID);
  const layoutNode = createLayoutSchema(layoutName, layoutType, refSchemaKey);
  const routeNode = attachToRouteNode(layoutNode, 'layout');

  return addRouteNodeToRootNode(rootNode, routeNode);
}
