import type { NameSpace } from '@orchestrationAPI/effects/api/api-namespace';
import type { TreeNode } from '@c/headless-tree/types';
import { treeNodeSorter } from '@c/headless-tree/utils';

import type APINamespaceTreeStore from './store/namespace';

export function apiNamespaceToTreeNode(
  namespace: NameSpace,
  child: NameSpace[] = [],
  level = 1,
  visible = false,
  expanded = true,
  parentId = namespace.id,
  order = 0,
  sort = false,
): TreeNode<NameSpace> {
  let children = child?.map(
    (dir) => apiNamespaceToTreeNode(
      dir, [], level + 1, true, false, namespace.id, stringToAsciiNumber(dir.name), sort,
    ),
  );

  if (sort) {
    children = children.sort(treeNodeSorter);
  }

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

export function stringToAsciiNumber(value: string): number {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
