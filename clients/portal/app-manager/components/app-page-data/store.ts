import { action, observable, computed, reaction, IReactionDisposer } from 'mobx';

import { formDataCurd } from '@appLib/api';
import toast from '@lib/toast';

class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  @observable tableConfig: any = {};
  @observable listLoading = false;
  @observable tableID = '';
  @observable curItemFormData = null;
  @observable allowRequestData = false;
  @observable filtrates: FilterField[] = [];
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable tableColumns = [];
  @observable params = {
    condition: [],
    sort: [],
    page: 1,
    size: this.pageSize ? this.pageSize : 99999,
  };
  @observable createFun = () => { };

  constructor() {
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
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
  setParams = (params: any) => {
    this.params = { ...this.params, ...params };
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
  goEdit = (formData: any) => {
    this.curItemFormData = formData;
    this.createFun();
  }

  @action
  delFormData = (ids: string[]) => {
    formDataCurd(this.tableID, {
      method: 'delete',
      condition: ids.map((id) => ({ key: id, op: 'eq', value: '' })),
    }).then((res) => {
      // this.formDataList = res.data.entities;
      toast.success('删除成功!');
    });
  }

  @action
  fetchFormDataList = (params: any) => {
    this.listLoading = true;
    formDataCurd(this.tableID, {
      method: 'find',
      page: 1,
      condition: [],
      sort: [],
      ...params,
    }).then((res) => {
      this.formDataList = res.data.entities;
      this.total = res.data.total || 0;
      this.listLoading = false;
    }).catch(() => {
      this.listLoading = false;
    });
  }
}

export default new AppPageDataStore();
