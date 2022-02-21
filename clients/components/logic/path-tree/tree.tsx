import { toJS } from 'mobx';

import HeadLessTree from '@c/headless-tree';

import type { TreeNode } from '@c/headless-tree/types';
import { isNodeSelectEnabled } from './util';

export default class Tree<T> extends HeadLessTree<T> {
  handleNodeClick = (node: TreeNode<T>): void => {
    if (!isNodeSelectEnabled(node)) {
      return;
    }
    this.props.store.onSelectNode(node.id);
    this.props.onSelect?.(toJS(node.data));
  };
}
