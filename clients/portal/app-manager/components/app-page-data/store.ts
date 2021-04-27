import { action, observable, computed } from 'mobx';

class AppPageDataStore {
  @observable tableConfig: any = {};
  @observable filtrates: FilterField[] = [];
  @observable tableColumns = [];

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
  setFiltrates = (filtrates: FilterField[]) => {
    this.filtrates = filtrates;
  }

  @action
  setTableColumns = (tableColumns: any) => {
    this.tableColumns = tableColumns;
  }
}

export default new AppPageDataStore();
