import { TreeNode } from '@c/headless-tree/types';

export const apiGroupToTreeNode = (group: APIGroup): TreeNode<APIGroup> | any => {
  const children = (group.child || []).map((item) => apiGroupToTreeNode(item));

  return {
    data: group,
    name: group.name,
    id: group.id,
    parentId: group.pid,
    path: '',
    isLeaf: !group.child?.length,
    visible: group.visible ?? true,
    childrenStatus: 'resolved',
    expanded: true,
    order: 0,
    level: group.level,
    children: children,
  };
};
