import { action, observable, computed } from 'mobx';
import TreeStore from '@c/headless-tree/store';
import { apiGroupToTreeNode } from './utils';

export class ApiGroupStore extends TreeStore<APIGroup> {
  constructor(groups: APIGroup | null | undefined) {
    if (groups) {
      // hide root node
      groups.visible = false;
      const rootNode = apiGroupToTreeNode(groups);

      super({ rootNode }, false);
    }
  }

  @computed get noLeafNodes(): boolean {
    return this.rootNode?.children?.length === 0;
  }
}

class Store {
  @observable activeGroup: APIGroup | null = null;
  @observable treeStore: ApiGroupStore | null = null;

  @action
  setActiveGroup=(group: APIGroup)=> {
    this.activeGroup = group;
    this.treeStore?.onSelectNode(group?.id);
  }

  @action
  setTreeStore=(store: ApiGroupStore)=> {
    this.treeStore = store;
  }
}

export default new Store();
