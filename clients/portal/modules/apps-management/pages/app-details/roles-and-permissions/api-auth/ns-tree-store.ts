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
  const children = child?.map(
    (dir, index) => {
      return apiNamespaceToTreeNode(
        dir, dir.children, level + 1, true, false, namespace.id, index, sort,
      );
    },
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
