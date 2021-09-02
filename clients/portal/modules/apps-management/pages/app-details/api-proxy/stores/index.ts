import { action, observable } from 'mobx';

class Store {
  @observable activeGroup: APIGroup | null = null;

  @action
  setActiveGroup=(group: APIGroup)=> {
    this.activeGroup = group;
  }
}

export default new Store();
