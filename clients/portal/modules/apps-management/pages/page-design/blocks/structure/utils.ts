import type { Node, ComposedNode } from '@one-for-all/artery';
import {
  previousSibling,
  nextSibling,
  firstChild,
  findNodeByID,
  ImmutableNode,
  getNodeParents,
} from '@one-for-all/artery-utils';
import { isArray } from 'lodash';

import isNodeSupportChildren from '@pageDesign/blocks/simulator/is-node-support-children';

type NodeOrComposedNode = Node | ComposedNode | undefined;

export function firstChildIs(rootNode: ImmutableNode, targetId: string, firstChildId: string): boolean {
  const firstChildPath = firstChild(rootNode, targetId);
  if (!firstChildPath) return false;
  return rootNode.getIn(firstChildPath.concat(['id'])) === firstChildId;
}

export function beforeIs(rootNode: ImmutableNode, targetId: string, beforeId: string): boolean {
  const prePath = previousSibling(rootNode, targetId);
  if (!prePath) return false;
  return rootNode.getIn(prePath.concat(['id'])) === beforeId;
}

export function afterIs(rootNode: ImmutableNode, targetId: string, nextId: string): boolean {
  const afterPath = nextSibling(rootNode, targetId);
  if (!afterPath) return false;
  return rootNode.getIn(afterPath.concat(['id'])) === nextId;
}

export async function canHasCurChildren(rootNode: Node, parentId: string, sourceId: string): Promise<boolean> {
  // todo: 判断父节点是否可以接收当前结点做为子节点?
  const parentNode = findNodeByID(rootNode, parentId) as NodeOrComposedNode;
  if (!parentNode) return false;
  if (parentNode.type === 'composed-node') return true;
  if (parentNode.type !== 'react-component' && parentNode.type !== 'html-element') return false;
  return await isNodeSupportChildren(parentNode);
}

export function filterChildren(children: Node[] | undefined): Node[] | undefined {
  return children?.filter((childNode) => !['jsx-node', 'ref-node'].includes(childNode.type));
}

// 1、若是路由结点：获取其绑定的node
// 2、若是单循环结点：获取其绑定的node
// 3、若是组合循环结点：遍历其nodes，并检查每一个nodes是否是真实结点并返回
export function getRealNode(node: Node): Node | Node[] | undefined {
  const { type } = node;

  if (['html-element', 'react-component'].includes(type)) return node;

  if (type === 'route-node') return getRealNode(node.node);

  if (type !== 'loop-container') return;

  const loopNode = node.node;

  if (loopNode.type === 'composed-node') {
    return loopNode.nodes.reduce((total: Node[], node) => {
      const realNode = getRealNode(node);
      if (!realNode) return total;
      if (isArray(realNode)) return [...total, ...realNode];
      return [...total, realNode];
    }, []);
  }

  return getRealNode(loopNode);
}

export function getReRealNodeId(rootNode: Node, currentId: string, isSource?: boolean): string | undefined {
  const parentNode = getNodeParents(rootNode, currentId)?.pop() as NodeOrComposedNode;
  if (!parentNode) return;

  const { type } = parentNode;

  if (['html-element', 'react-component'].includes(type)) return currentId;

  if (type === 'route-node') return getReRealNodeId(rootNode, parentNode.id);

  if (type === 'composed-node') {
    if (isSource && parentNode.nodes.length === 1) {
      return getReRealNodeId(rootNode, parentNode.id);
    }
    return currentId;
  }

  if (type !== 'loop-container') return;

  return getReRealNodeId(rootNode, parentNode.id);
}
