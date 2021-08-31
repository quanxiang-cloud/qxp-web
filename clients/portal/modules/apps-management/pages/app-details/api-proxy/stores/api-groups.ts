import TreeStore from '@c/headless-tree/store';
import { apiGroupToTreeNode } from '../utils';

export default class Store extends TreeStore<APIGroup> {
  constructor(groups: APIGroup) {
    super({ rootNode: apiGroupToTreeNode(groups) });
  }
}
