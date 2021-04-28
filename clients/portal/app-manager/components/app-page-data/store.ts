import { action, observable, computed, reaction, IReactionDisposer } from 'mobx';

// import { formDataCurd } from '@appLib/api';

class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  @observable tableConfig: any = {};
  @observable tableID = '';
  @observable filtrates: FilterField[] = [];
  @observable formDataList: any[] = [];
  @observable tableColumns = [];
  @observable params = { condition: [], sort: [] };
  @observable createFun = () => { };

  constructor() {
    this.destroyFetchTableData = reaction(() => this.pageParams, this.fetchFormDataList);
  }

  @computed get pageParams(): any {
    return {
      tableID: this.tableID,
      params: this.params,
    };
  }

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
  setTableID = (tableID: string) => {
    this.tableID = tableID;
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

  @action
  setCreateFun = (createFun: () => void) => {
    this.createFun = createFun;
  }

  @action
  fetchFormDataList = ({ tableID, params }: any) => {
    // this.formDataList
    // formDataCurd(tableID, {
    //   method: 'find',
    //   page: 1,
    //   size: this.pageSize || 99999,
    //   ...params,
    // }).then((res) => {
    //   console.log('res: ', res);
    // });
  }
}

export default new AppPageDataStore();
