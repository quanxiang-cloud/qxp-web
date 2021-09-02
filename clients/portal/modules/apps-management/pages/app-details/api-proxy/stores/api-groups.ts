import TreeStore from '@c/headless-tree/store';
import { apiGroupToTreeNode } from '../utils';

export default class Store extends TreeStore<APIGroup> {
  constructor(groups: APIGroup) {
    // hide root node
    groups.visible = false;
    const rootNode = apiGroupToTreeNode(groups);

    super({ rootNode }, false);
  }
}
