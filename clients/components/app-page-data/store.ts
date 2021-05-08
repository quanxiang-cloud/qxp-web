import React from 'react';
import { action, observable, reaction, IReactionDisposer } from 'mobx';

import { formDataCurd } from '@portal/modules/apps-management/lib/api';
import toast from '@lib/toast';

import { Scheme } from './utils';
type Params = {
  condition?: Condition[] | [],
  sort?: string[] | [],
  page?: number,
  size?: number,
}

class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  @observable tableConfig: any = {};
  @observable noFiltratesTips: React.ReactNode = '尚未配置筛选条件。'
  @observable listLoading = false;
  @observable pageID = '';
  @observable pageName = '';
  @observable curItemFormData = null;
  @observable allowRequestData = false;
  @observable filtrates: FilterField[] = [];
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable fields: Scheme[] = [];
  @observable tableColumns = [];
  @observable params: Params = {
    condition: [],
    sort: [],
    page: 1,
    size: 10,
  };
  @observable createFun = () => { };

  constructor() {
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
    this.destroySetTableConfig = reaction(() => {
      return {
        size: this.tableConfig.pageSize || 9999,
        sort: this.tableConfig.order ? [this.tableConfig.order] : []
      };
    }, this.setParams);
  }

  @action
  setParams = (params: Params) => {
    this.params = { ...this.params, ...params };
  }

  @action
  setFieldsMap = (fieldsMap: Scheme) => {
    const fields: Scheme[] = [];
    Object.keys(fieldsMap).forEach((key: string) => {
      if (key !== '_id') {
        fields.push({ id: key, ...fieldsMap[key] })
      }
    });
    this.fields = fields;
  }

  @action
  setPageID = (pageID: string, pageName?: string) => {
    this.pageID = pageID;
    pageName && (this.pageName = pageName);
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
    return formDataCurd(this.pageID, {
      method: 'delete',
      condition: ids.map((id) => ({ key: '_id', op: 'eq', value: [id] })),
    }).then(() => {
      this.formDataList = this.formDataList.filter(({ _id }) => !ids.includes(_id));
      toast.success('删除成功!');
    });
  }

  @action
  fetchFormDataList = (params: Params) => {
    if (!this.allowRequestData || !this.pageID) {
      return;
    }
    this.listLoading = true;
    formDataCurd(this.pageID, {
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

  @action
  fetchFormDataDetails = (dataID: string) => {
    return formDataCurd(this.pageID, {
      method: 'findOne',
      condition: [
        {
          key: "_id",
          op: "eq",
          value: [dataID]
        }
      ]
    })
  }

  @action
  clear = () => {
    this.formDataList = [];
    this.tableConfig = {};
    this.filtrates = [];
    this.tableColumns = [];
    this.pageID = '';
    this.params = {
      condition: [],
      sort: [],
      page: 1,
      size: 10,
    };
  }
}

export default new AppPageDataStore();
