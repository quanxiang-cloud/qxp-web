import { Node } from '@one-for-all/artery';

import { Layout } from '../types';
import createLayoutSchema from './create-layout-schema';
import { addRouteNodeToRootNode, attachToRouteNode, copyRefSchema, createRefSchema } from './utils';

type Params = {
  appID: string;
  rootNode: Node;
  layoutInfo: CreateLayoutInfo;
  refSchemaID?: string;
  initProps?: any;
}

export type CreateLayoutInfo = Pick<Layout, 'name' | 'type' > & { refSchemaID?: string, description?: string;}

export default async function addLayoutToRoot(
  { appID, rootNode, layoutInfo }: Params,
): Promise<Node | undefined> {
  const refSchemaKey = await createRefSchema(appID);
  const layoutNode = createLayoutSchema({ layoutInfo, refSchemaKey });
  const routeNode = attachToRouteNode(layoutNode, 'layout');

  return addRouteNodeToRootNode(rootNode, routeNode);
}

export async function copyLayoutToRoot( // todo with one addLayoutToRoot method
  { appID, rootNode, layoutInfo }: Params,
): Promise<Node | undefined> {
  if (!layoutInfo.refSchemaID) return;
  const refSchemaKey = await copyRefSchema(appID, layoutInfo.refSchemaID);
  const layoutNode = createLayoutSchema({ layoutInfo, refSchemaKey });
  const routeNode = attachToRouteNode(layoutNode, 'layout');

  return addRouteNodeToRootNode(rootNode, routeNode);
}
