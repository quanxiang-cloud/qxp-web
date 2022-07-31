import { Node } from '@one-for-all/artery';
import { addRouteNodeToLayout, attachToRouteNode } from './utils';

export default function addViewToLayout(
  rootNode: Node,
  layoutID: string,
  view: Node,
): Node | undefined {
  const routeNode = attachToRouteNode(view, 'view');
  return addRouteNodeToLayout(rootNode, layoutID, routeNode);
}
