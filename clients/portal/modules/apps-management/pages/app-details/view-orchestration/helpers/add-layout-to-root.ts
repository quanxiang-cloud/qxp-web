import { SchemaNode } from '@one-for-all/schema-spec';
import { LayoutType } from '../types';
import createLayoutSchema from './create-layout-schema';
import { addRouteNodeToRootNode, attachToRouteNode, createRefSchema } from './utils';

type Params = {
  appID: string;
  rootNode: SchemaNode;
  layoutType: LayoutType;
  layoutName: string;
}

export default async function addLayoutToRoot(
  { appID, rootNode, layoutType, layoutName }: Params,
): Promise<SchemaNode | undefined> {
  const refSchemaKey = await createRefSchema(appID);
  const layoutNode = createLayoutSchema(layoutName, layoutType, refSchemaKey);
  const routeNode = attachToRouteNode(layoutNode, 'layout');

  return addRouteNodeToRootNode(rootNode, routeNode);
}
