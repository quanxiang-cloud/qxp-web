import { isArray } from 'lodash';

import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

import type { TreeNodeDataType } from './type';

function buildRootNode(
  data: TreeNodeDataType,
  child: TreeNodeDataType[] = [],
  level = 1,
  visible = false,
  expanded = true,
  parentId = '',
  parentDescPath = '',
  order = 0,
): TreeNode<TreeNodeDataType> {
  let name = '';
  let desc = '';
  if (data.desc) {
    desc = data.desc;
  }
  if (data.name) {
    name = data.name;
  } else if (order >= 1) {
    name = `[${order - 1}]`;
  }
  if (!desc) {
    desc = name;
  }
  const id = parentId ? `${parentId}.${name}` : `${name ? '$' + name : ''}`;
  const descPath = parentDescPath ? `${parentDescPath}.${desc}` : desc;

  const children = child?.filter(Boolean).map((polyNodeInput, index) => buildRootNode(
    polyNodeInput,
    isArray(polyNodeInput.data) ? polyNodeInput.data : [],
    level + 1,
    true,
    false,
    id,
    descPath,
    index + 1,
  ));

  const treeNode: TreeNode<TreeNodeDataType> = {
    data,
    name,
    id,
    path: id,
    parentId: parentId || '',
    isLeaf: !child.length,
    visible: visible,
    childrenStatus: 'unknown',
    expanded,
    order,
    level,
    children,
  };

  Object.assign(treeNode.data, {
    descPath: descPath.replace(/\s/g, ''),
  });

  return treeNode;
}

export default class PathTreeStore extends TreeStore<TreeNodeDataType> {
  constructor(root: TreeNodeDataType, child: TreeNodeDataType[]) {
    super({ rootNode: buildRootNode(root, child), disableExpandNodeOnSelect: true }, true);
  }
}
