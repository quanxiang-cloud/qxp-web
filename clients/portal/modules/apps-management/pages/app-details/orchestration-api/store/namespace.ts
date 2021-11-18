import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

import { apiNamespaceToTreeNode } from '@orchestrationAPI/utils';
import type { NameSpace } from '@orchestrationAPI/effects/api/api-namespace';
import { getNameSpaceList } from '@orchestrationAPI/effects/api/api-namespace';

export default class APINamespaceTreeStore extends TreeStore<NameSpace> {
  constructor(root: NameSpace, child: NameSpace[]) {
    super({ rootNode: apiNamespaceToTreeNode(root, child), disableExpandNodeOnSelect: true }, true);
  }

  onGetChildren = async (node: TreeNode<NameSpace>): Promise<TreeNode<NameSpace>[]> => {
    const { list } = await getNameSpaceList(node.path.slice(1));
    return list.map((namespace) => apiNamespaceToTreeNode(namespace, [], node.level + 1, true, false));
  }
}
