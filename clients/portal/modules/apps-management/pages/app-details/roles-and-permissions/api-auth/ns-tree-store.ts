import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

export default class NsTreeStore extends TreeStore<PolyAPI.Namespace> {
  treeNodeHeight = 36;

  constructor(root: PolyAPI.Namespace) {
    super({
      rootNode: apiNamespaceToTreeNode(root, root.children),
      singleMode: true,
      disableExpandNodeOnSelect: true,
    }, true);
  }
}

export function apiNamespaceToTreeNode(
  namespace: PolyAPI.Namespace,
  child: PolyAPI.Namespace[] = [],
  level = 1,
  visible = false,
  expanded = true,
  parentId = namespace.id,
  order = 0,
  sort = false,
): TreeNode<PolyAPI.Namespace> {
  let children = child?.map(
    (dir) => {
      return apiNamespaceToTreeNode(
        dir, dir.children, level + 1, true, false, namespace.id, stringToAsciiNumber(dir.name), sort,
      );
    },
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

export function stringToAsciiNumber(value: string): number {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function treeNodeSorter(nodeA: TreeNode<any>, nodeB: TreeNode<any>): 1 | -1 {
  if (nodeA.isLeaf === nodeB.isLeaf) {
    return nodeA.order < nodeB.order ? -1 : 1;
  }

  return nodeA.isLeaf ? 1 : -1;
}
