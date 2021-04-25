import { action, observable, computed } from 'mobx';

class AppPageDataStore {
  @observable showMoreFiltrate = false;

  @observable filterList = [];

  @observable tableConfig: any = {};

  @computed get order(): any {
    if ('order' in this.tableConfig) {
      return this.tableConfig.order;
    }
    return null;
  }

  @computed get pageSize(): null | number {
    if ('pageSize' in this.tableConfig) {
      return this.tableConfig.pageSize;
    }
    return null;
  }

  @action
  setTableConfig = (tableConfig: any) => {
    this.tableConfig = tableConfig;
  }

  @action
  setShowMoreFiltrate = (value: boolean) => {
    this.showMoreFiltrate = value;
  }

  @action
  setFilterList = (filterList: any) => {
    this.filterList = filterList;
  }
}

export default new AppPageDataStore();
