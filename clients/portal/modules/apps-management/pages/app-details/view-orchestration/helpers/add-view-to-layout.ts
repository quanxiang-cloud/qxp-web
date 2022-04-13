import { SchemaNode } from '@one-for-all/schema-spec';
import { addRouteNodeToLayout, attachToRouteNode } from './utils';

export default function addViewToLayout(
  rootNode: SchemaNode,
  layoutID: string,
  view: SchemaNode,
): SchemaNode | undefined {
  const routeNode = attachToRouteNode(view, 'view');
  return addRouteNodeToLayout(rootNode, layoutID, routeNode);
}
