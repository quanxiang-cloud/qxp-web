import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

import { apiNamespaceToTreeNode, stringToAsciiNumber } from '@orchestrationAPI/utils';
import { getNameSpaceList } from '@orchestrationAPI/effects/api/api-namespace';

export default class APINamespaceTreeStore extends TreeStore<PolyAPI.Namespace> {
  treeNodeHeight = 36;

  constructor(root: PolyAPI.Namespace, child: PolyAPI.Namespace[]) {
    super({
      rootNode: apiNamespaceToTreeNode(root, child, 1, false, true, root.id, 0, true),
      disableExpandNodeOnSelect: true,
    }, true);
  }

  onGetChildren = async (node: TreeNode<PolyAPI.Namespace>): Promise<TreeNode<PolyAPI.Namespace>[]> => {
    const { list } = await getNameSpaceList(node.path.slice(1));
    const children = list.map(
      (namespace) => apiNamespaceToTreeNode(
        namespace, [], node.level + 1, true, false, node.id, stringToAsciiNumber(namespace.name),
      ),
    );
    const childrenMap = node.children?.reduce(
      (acc: Record<string, TreeNode<PolyAPI.Namespace>>, child: TreeNode<PolyAPI.Namespace>) => {
        acc[child.id] = child;
        return acc;
      }, {});
    return children.map((child) => {
      const expanded = childrenMap?.[child.id]?.expanded ?? child.expanded;
      Object.assign(child, {
        expanded,
        children: childrenMap?.[child.id]?.children ?? child.children,
        order: childrenMap?.[child.id]?.order ?? child.order,
        childrenStatus: expanded ? 'resolved' : 'unknown',
      });
      return child;
    });
  };
}
