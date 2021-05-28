import React from 'react';
import { action, observable, reaction, IReactionDisposer } from 'mobx';

import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import { Scheme, Config, getPageDataSchema } from './utils';

type Params = {
  condition?: Condition[] | [],
  sort?: string[] | [],
  page?: number,
  size?: number,
}

type InitData = {
  schema: Scheme;
  config?: Config;
  pageID?: string;
  appID?: string;
  pageName?: string;
  createFun?: () => void;
  allowRequestData?: boolean;
}

class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  @observable tableConfig: any = {};
  @observable noFiltratesTips: React.ReactNode = '尚未配置筛选条件。'
  @observable listLoading = false;
  @observable pageID = '';
  @observable appID = '';
  @observable pageName = '';
  @observable authority = 0;
  @observable curItemFormData = null;
  @observable allowRequestData = false;
  @observable filtrates: FilterField[] = [];
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable fields: Scheme[] = [];
  @observable tableColumns: any[] = [];
  @observable params: Params = {
    condition: [],
    sort: [],
    page: 1,
    size: 10,
  };
  @observable createFun = () => {
    '';
  };

  constructor({ schema, pageID, pageName, appID, config, allowRequestData, createFun }: InitData) {
    this.pageName = pageName || '';
    this.appID = appID || '';
    this.pageID = pageID || '';
    this.allowRequestData = !!allowRequestData;
    if (createFun) {
      this.createFun = createFun;
    }
    const { filtrates, tableColumns, pageTableShowRule, fields } = getPageDataSchema(config || {}, schema);
    this.fields = fields;
    this.setFiltrates(filtrates);
    this.setTableColumns(tableColumns);
    this.setTableConfig(pageTableShowRule);
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
    this.destroySetTableConfig = reaction(() => {
      return {
        size: this.tableConfig.pageSize || 9999,
        sort: this.tableConfig.order ? [this.tableConfig.order] : [],
      };
    }, this.setParams);
  }

  @action
  setParams = (params: Params) => {
    this.params = { ...this.params, ...params };
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
  goEdit = (formData: any) => {
    this.curItemFormData = formData;
    this.createFun?.();
  }

  @action
  delFormData = (ids: string[]) => {
    return httpClient(`/api/v1/structor/${this.appID}/` +
      `${window.SIDE === 'portal' ? 'm' : 'home'}/form/${this.pageID}`, {
      method: 'delete',
      condition: [{ key: '_id', op: ids.length > 1 ? 'in' : 'eq', value: ids }],
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
    const side = window.SIDE === 'portal' ? 'm' : 'home';
    httpClient(`/api/v1/structor/${this.appID}/${side}/form/${this.pageID}`, {
      method: 'find',
      page: 1,
      condition: [],
      sort: [],
      ...params,
    }).then((res: any) => {
      this.formDataList = res.entities;
      this.total = res.total || 0;
      this.listLoading = false;
    }).catch(() => {
      this.listLoading = false;
    });
  }

  @action
  fetchFormDataDetails = (dataID: string) => {
    const side = window.SIDE === 'portal' ? 'm' : 'home';
    return httpClient(`/api/v1/structor/${this.appID}/${side}/form/${this.pageID}`, {
      method: 'findOne',
      condition: [
        {
          key: '_id',
          op: 'eq',
          value: [dataID],
        },
      ],
    });
  }

  @action
  fetchActionAuthorized = () => {
    if (!this.pageID) {
      return;
    }
    const side = window.SIDE === 'portal' ? 'm' : 'home';
    httpClient(
      `/api/v1/structor/${this.appID}/${side}/permission/operatePer/getByScopeID`,
      { formID: this.pageID }
    ).then((res: any) => {
      this.authority = res?.authority || 0;
    });
  }

  @action
  clear = () => {
    this.curItemFormData = null;
    this.formDataList = [];
    this.tableConfig = {};
    this.authority = 0;
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

export default AppPageDataStore;
