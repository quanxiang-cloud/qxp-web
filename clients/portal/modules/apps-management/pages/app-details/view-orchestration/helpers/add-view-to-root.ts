import { SchemaNode } from '@one-for-all/schema-spec';
import { addRouteNodeToRootNode, attachToRouteNode } from './utils';

export default function addViewToRoot(rootNode: SchemaNode, view: SchemaNode): SchemaNode | undefined {
  const routeNode = attachToRouteNode(view, 'view');
  return addRouteNodeToRootNode(rootNode, routeNode);
}
