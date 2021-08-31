import React from 'react';
import { UnionColumns } from 'react-table';
import { action, observable, reaction, IReactionDisposer } from 'mobx';

import httpClient from '@lib/http-client';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';

import { TableHeaderBtn, TableConfig } from './type';
import { Config, getPageDataSchema } from './utils';

type Params = {
  condition?: Condition[] | [],
  tag?: 'or' | 'and',
  sort?: string[] | [],
  page?: number,
  size?: number,
}

export type FormAppDataTableStoreSchema = Omit<ISchema, 'properties'> & {
  properties?: Record<string, SchemaFieldItem>
};

type InitData = {
  schema: ISchema;
  config?: Config;
  pageID?: string;
  appID?: string;
  showCheckbox?: boolean;
  allowRequestData?: boolean;
  tableHeaderBtnList?: TableHeaderBtn[];
  customColumns?: UnionColumns<any>[];
  filterConfig?: FilterConfig;
}

export type FormData = Record<string, any>;
class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  @observable tableConfig: TableConfig = { pageSize: 10, order: undefined };
  @observable noFiltersTips: React.ReactNode = '尚未配置筛选条件。';
  @observable listLoading = false;
  @observable showCheckbox = true;
  @observable pageID = '';
  @observable appID = '';
  @observable allowRequestData = false;
  @observable filterConfig: FilterConfig | null = null;
  @observable filters: Filters = [];
  @observable selected: string[] = [];
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable fields: SchemaFieldItem[] = [];
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
    showCheckbox = true,
    filterConfig,
  }: InitData) {
    const { tableColumns, pageTableShowRule } = getPageDataSchema(config || {}, schema, customColumns);
    this.setSchema(schema);
    this.filterConfig = filterConfig || null;
    this.showCheckbox = showCheckbox;
    this.tableHeaderBtnList = tableHeaderBtnList;
    this.setTableColumns(tableColumns);
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
    this.destroySetTableConfig = reaction(() => {
      return {
        size: this.tableConfig.pageSize || 10,
        sort: this.tableConfig.order ? [this.tableConfig.order] : [],
      };
    }, this.setParams);
    this.setTableConfig(pageTableShowRule);
    this.appID = appID || '';
    this.pageID = pageID || '';
    this.allowRequestData = !!allowRequestData;

    if (config?.filters) {
      this.setFilters(config.filters || []);
    }
  }

  @action
  setSelected = (selected: string[]): void => {
    this.selected = selected;
  }

  @action
  setParams = (params: Params): void => {
    this.params = { ...this.params, ...params };
  }

  @action
  setSchema = (schema?: ISchema): void => {
    if (!schema) {
      return;
    }

    this.schema = schema;
    this.fields = schemaToFields(schema);
  }

  @action
  setTableConfig = (tableConfig: TableConfig): void => {
    this.tableConfig = tableConfig;
  }

  @action
  setFilters = (filters: Filters): void => {
    this.filters = filters.filter((key) => {
      return SYSTEM_FIELDS.includes(key) || key in (schemaToMap(this.schema) || {});
    });
  }

  @action
  setTableColumns = (tableColumns: UnionColumns<any>[]): void => {
    this.tableColumns = tableColumns;
  }

  @action
  fetchFormDataList = (params: Params): void => {
    if (!this.allowRequestData || !this.pageID) {
      return;
    }

    this.listLoading = true;
    const { condition = [], tag, ...other } = params;
    const { condition: frontCondition = [], tag: frontTag } = this.filterConfig || {};
    httpClient(`/api/v1/form/${this.appID}/home/form/${this.pageID}`, {
      method: 'find',
      page: 1,
      conditions: { tag: frontTag || tag, condition: [...condition, ...frontCondition] },
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

  @action
  clear = (): void => {
    this.formDataList = [];
    this.tableConfig = { pageSize: 10, order: undefined };
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
