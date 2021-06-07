import React from 'react';
import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';

import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import { Scheme, Config, getPageDataSchema } from './utils';

type Params = {
  condition?: Condition[] | [],
  tag?: 'or' | 'and',
  sort?: string[] | [],
  page?: number,
  size?: number,
}

type InitData = {
  schema: FormBuilder.Schema;
  config?: Config;
  pageID?: string;
  appID?: string;
  pageName?: string;
  allowRequestData?: boolean;
}

export type FormData = Record<string, any>;

class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  @observable tableConfig: any = {};
  @observable noFiltersTips: React.ReactNode = '尚未配置筛选条件。'
  @observable listLoading = false;
  @observable pageID = '';
  @observable appID = '';
  @observable pageName = '';
  @observable authority = 0;
  @observable curItemFormData: FormData | null = null;
  @observable allowRequestData = false;
  @observable filterMaps: FilterMaps = {};
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable fields: Fields[] = [];
  @observable schema: FormBuilder.Schema = {};
  @observable filterData: FormData = {};
  @observable tableColumns: any[] = [];
  @observable createPageVisible = false;
  @observable params: Params = {
    condition: [],
    sort: [],
    page: 1,
    size: 10,
    tag: 'and',
  };

  constructor({ schema, pageID, pageName, appID, config, allowRequestData }: InitData) {
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
    this.destroySetTableConfig = reaction(() => {
      return {
        size: this.tableConfig.pageSize || 9999,
        sort: this.tableConfig.order ? [this.tableConfig.order] : [],
      };
    }, this.setParams);
    this.schema = schema || {};
    this.pageName = pageName || '';
    this.appID = appID || '';
    this.pageID = pageID || '';
    this.allowRequestData = !!allowRequestData;

    if (config?.filter) {
      this.setFilters(config.filter || {});
    }

    const { tableColumns, pageTableShowRule, fields } = getPageDataSchema(config || {}, schema);
    this.fields = fields;
    this.setTableColumns(tableColumns);
    this.setTableConfig(pageTableShowRule);
  }

  @action
  setParams = (params: Params) => {
    this.params = { ...this.params, ...params };
  }

  @action
  setSchema = (schema: Scheme | undefined) => {
    if (!schema) {
      return;
    }

    this.schema = schema;
    this.fields = Object.keys(this.schema).map((key) => ({
      id: key,
      ...schema.properties[key],
    }));
  }

  @action
  setTableConfig = (tableConfig: any) => {
    this.tableConfig = tableConfig;
  }

  @action
  setFilters = (filterMaps: FilterMaps) => {
    this.filterMaps = filterMaps;
  }

  @action
  setTableColumns = (tableColumns: any) => {
    this.tableColumns = tableColumns;
  }

  @action
  setVisibleCreatePage = (createPageVisible: boolean) => {
    this.createPageVisible = createPageVisible;
  }

  @action
  goEdit = (formData: FormData | null) => {
    this.curItemFormData = formData;
    this.setVisibleCreatePage(true);
  }

  @action
  delFormData = (ids: string[]) => {
    return httpClient(`/api/v1/structor/${this.appID}/` +
      `${window.SIDE === 'portal' ? 'm' : 'home'}/form/${this.pageID}`, {
      method: 'delete',
      conditions: { condition: [{ key: '_id', op: ids.length > 1 ? 'in' : 'eq', value: ids }] },
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
    const { condition, tag, ...other } = params;
    httpClient(`/api/v1/structor/${this.appID}/${side}/form/${this.pageID}`, {
      method: 'find',
      page: 1,
      conditions: { tag: tag, condition },
      sort: [],
      ...other,
    }).then((res: any) => {
      this.formDataList = res.entities;
      this.total = res.total || 0;
      this.listLoading = false;
    }).catch(() => {
      this.listLoading = false;
    });
  }

  @computed
  get formDataListLabel(): any[] {
    const prproperties = this.schema.properties || {};

    const complexKeys = Object.keys(prproperties)
      .filter((key)=>prproperties[key].type == 'label-value');

    return this.formDataList.map((itm) => {
      const newData: any = {};

      Object.keys(itm).forEach((key: string) => {
        if (complexKeys.includes(key )) {
          newData[key] = itm[key].map((itm: any) => itm.label);
        } else {
          newData[key] = itm[key];
        }
      });

      return newData;
    });
  }

  @action
  fetchFormDataDetails = (dataID: string) => {
    const side = window.SIDE === 'portal' ? 'm' : 'home';
    return httpClient(`/api/v1/structor/${this.appID}/${side}/form/${this.pageID}`, {
      method: 'findOne',
      conditions: {
        condition: [
          {
            key: '_id',
            op: 'eq',
            value: [dataID],
          },
        ],
        tag: 'and',
      },
    });
  }

  @action
  fetchActionAuthorized = () => {
    if (!this.pageID) {
      return;
    }

    const side = window.SIDE === 'portal' ? 'm' : 'home';
    httpClient(
      `/api/v1/structor/${this.appID}/${side}/permission/operatePer/getOperate`,
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
    this.filterMaps = {};
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
