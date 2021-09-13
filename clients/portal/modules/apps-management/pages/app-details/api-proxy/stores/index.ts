import { action, observable } from 'mobx';

import GroupTreeStore from './api-groups';

class Store {
  @observable activeGroup: APIGroup | null = null;
  @observable treeStore: GroupTreeStore | null = null;

  @action
  setActiveGroup=(group: APIGroup)=> {
    this.activeGroup = group;
    this.treeStore?.onSelectNode(group?.id);
  }

  @action
  setTreeStore=(store: GroupTreeStore)=> {
    this.treeStore = store;
  }
}

export default new Store();
