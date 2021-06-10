import React from 'react';
import { UnionColumns } from 'react-table';
import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';

import httpClient from '@lib/http-client';

import { TableHeaderBtn } from './type';
import { Config, getPageDataSchema } from './utils';

type Params = {
  condition?: Condition[] | [],
  tag?: 'or' | 'and',
  sort?: string[] | [],
  page?: number,
  size?: number,
}

type InitData = {
  schema: ISchema;
  config?: Config;
  pageID?: string;
  appID?: string;
  allowRequestData?: boolean;
  tableHeaderBtnList?: TableHeaderBtn[];
  customColumns?: UnionColumns<any>[];
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
  @observable allowRequestData = false;
  @observable filters: Filters = [];
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable fields: Fields[] = [];
  @observable schema: ISchema = {};
  @observable filterData: FormData = {};
  @observable tableColumns: UnionColumns<FormData>[] = [];
  @observable tableHeaderBtnList: TableHeaderBtn[] = [];
  @observable params: Params = {
    condition: [],
    sort: [],
    page: 1,
    size: 10,
    tag: 'and',
  };

  constructor({
    schema,
    pageID,
    appID,
    config,
    allowRequestData,
    tableHeaderBtnList = [],
    customColumns = [],
  }: InitData) {
    const { tableColumns, pageTableShowRule } = getPageDataSchema(config || {}, schema, customColumns);
    this.setSchema(schema);
    this.tableHeaderBtnList = tableHeaderBtnList;
    this.setTableColumns(tableColumns);
    this.setTableConfig(pageTableShowRule);
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
    this.destroySetTableConfig = reaction(() => {
      return {
        size: this.tableConfig.pageSize || 9999,
        sort: this.tableConfig.order ? [this.tableConfig.order] : [],
      };
    }, this.setParams);
    this.appID = appID || '';
    this.pageID = pageID || '';
    this.allowRequestData = !!allowRequestData;

    if (config?.filters) {
      this.setFilters(config.filters || []);
    }
  }

  @action
  setParams = (params: Params): void => {
    this.params = { ...this.params, ...params };
  }

  @action
  setSchema = (schema: ISchema | undefined): void => {
    if (!schema) {
      return;
    }

    this.schema = schema;
    this.fields = Object.entries(schema.properties || {}).map(([key, fieldSchema]) => {
      return {
        id: key,
        ...fieldSchema,
      };
    });
  }

  @action
  setTableConfig = (tableConfig: any): void => {
    this.tableConfig = tableConfig;
  }

  @action
  setFilters = (filters: Filters): void => {
    this.filters = filters;
  }

  @action
  setTableColumns = (tableColumns: UnionColumns<any>[]): void => {
    this.tableColumns = tableColumns;
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
    const properties = this.schema.properties || {};

    const complexKeys = Object.keys(properties)
      .filter((key) => properties[key].type == 'label-value');

    return this.formDataList.map((itm) => {
      const newData: any = {};

      Object.keys(itm).forEach((key: string) => {
        if (complexKeys.includes(key)) {
          newData[key] = itm[key].map((itm: any) => itm.label);
        } else {
          newData[key] = itm[key];
        }
      });

      return newData;
    });
  }

  @action
  clear = (): void => {
    this.formDataList = [];
    this.tableConfig = {};
    this.filters = [];
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
