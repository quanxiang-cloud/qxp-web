import { and } from 'ramda';

import { TreeNode } from '@c/headless-tree/types';

import { TreeNodeDataType } from './type';

export function getRootNode(): TreeNodeDataType {
  return {
    type: 'object',
    name: '',
    desc: '',
    data: [],
    in: 'body',
    required: false,
  };
}

export function isNodeSelectEnabled<T>(node: TreeNode<T>): boolean {
  if (node.level !== 2) {
    return true;
  }
  return and(node.id.startsWith('$webhook'), node.name !== 'start');
}
