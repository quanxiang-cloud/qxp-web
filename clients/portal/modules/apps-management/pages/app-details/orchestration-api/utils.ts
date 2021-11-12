
import type { NameSpace } from '@orchestrationAPI/effects/api/api-namespace';
import type { TreeNode } from '@c/headless-tree/types';

import type APINamespaceTreeStore from './store/namespace';

export function apiNamespaceToTreeNode(
  namespace: NameSpace,
  child: NameSpace[] = [],
  level = 1,
  visible = false,
  expanded = true,
  parentId = namespace.id,
  order = 0,
): TreeNode<NameSpace> {
  const children = child?.map(
    (dir, index) => apiNamespaceToTreeNode(dir, [], level + 1, true, false, namespace.id, index + 1),
  );

  return {
    data: namespace,
    name: namespace.title,
    id: namespace.id,
    parentId: parentId || namespace.parent || '',
    path: `${namespace.parent}/${namespace.name}`,
    isLeaf: !namespace.subCount,
    visible: visible,
    childrenStatus: 'unknown',
    expanded,
    order,
    level,
    children,
  };
}

export function getNamespaceNodeSiblingNodes(
  store?: APINamespaceTreeStore | null,
): undefined | Array<TreeNode<NameSpace>> {
  const currentNode = store?.currentFocusedNode as TreeNode<NameSpace> | undefined;
  const parentNode = store?.getNode(currentNode?.parentId || '');
  return parentNode?.children;
}
