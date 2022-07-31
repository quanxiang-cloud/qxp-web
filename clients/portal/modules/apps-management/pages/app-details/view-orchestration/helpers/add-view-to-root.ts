import { Node } from '@one-for-all/artery';
import { addRouteNodeToRootNode, attachToRouteNode } from './utils';

export default function addViewToRoot(rootNode: Node, view: Node): Node | undefined {
  const routeNode = attachToRouteNode(view, 'view');
  return addRouteNodeToRootNode(rootNode, routeNode);
}
