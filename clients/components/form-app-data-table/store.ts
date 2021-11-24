import React from 'react';
import { UnionColumns } from 'react-table';
import { action, observable, reaction, computed, IReactionDisposer } from 'mobx';
import { toPairs, fromPairs, set } from 'lodash';
import { pipe, map } from 'lodash/fp';

import { fetchFormDataList } from '@lib/http-client';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { toEs } from '@c/data-filter/utils';

import { TableHeaderBtn, TableConfig } from './type';
import { Config, getPageDataSchema } from './utils';

type Params = {
  condition?: Condition[] | [],
  tag?: FilterTag,
  sort?: string[] | [],
  page?: number,
  size?: number,
}

type FormTableConfig = {
  hidden: boolean;
  fixed?: boolean
}

type ColumnConfig = Record<string, FormTableConfig>

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
  canAcrossPageChoose?: boolean;
  onSelect?: (ids: string[], rows: Record<string, any>[]) => void;
  defaultSelect?: string[]
}

export type FormData = Record<string, any>;
class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  onSelect: ((ids: string[], rows: Record<string, any>[]) => void) | undefined = undefined;
  @observable tableConfig: TableConfig = { pageSize: 10, order: undefined };
  @observable noFiltersTips: React.ReactNode = '尚未配置筛选条件。';
  @observable listLoading = false;
  @observable canSetColumnWidth = true;
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
  @observable columnConfig: ColumnConfig = {};
  @observable canAcrossPageChoose = false;
  @observable customColumns: UnionColumns<FormData>[] = [];
  @observable params: Params = {
    condition: [],
    sort: [],
    page: 1,
    size: 10,
    tag: 'must',
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
    canAcrossPageChoose = false,
    defaultSelect,
    onSelect,
  }: InitData) {
    const { tableColumns, pageTableShowRule } = getPageDataSchema(config || {}, schema);
    this.setSchema(schema);
    this.filterConfig = filterConfig || null;
    this.onSelect = onSelect;
    this.canAcrossPageChoose = canAcrossPageChoose;
    this.selected = defaultSelect || [];
    this.customColumns = customColumns;
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

  @computed get tableShowColumns(): UnionColumns<FormData>[] {
    const _columns = this.tableColumns.reduce<UnionColumns<FormData>[]>((acc, col) => {
      const curConfig = this.columnConfig[col.id || ''] || {};
      if (!curConfig.hidden) {
        return [...acc, { ...col, fixed: 'fixed' in curConfig ? curConfig.fixed : col.fixed }];
      }

      return acc;
    }, []);

    return [..._columns, ...this.customColumns];
  }

  @action
  setSelected = (selected: string[], rows: Record<string, any>[]): void => {
    this.selected = selected;
    this.onSelect?.(selected, rows);
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
      return key in (schemaToMap(this.schema) || {});
    });
  }

  @action
  resetColumnConfig = (): void => {
    this.columnConfig = {};
  }

  @action
  selectAllColumn = (type: boolean): void => {
    if (type) {
      const process = pipe(
        toPairs,
        map(([key, config]) => {
          return [key, { ...config, hidden: false }];
        }),
        fromPairs,
      );
      this.columnConfig = process(this.columnConfig);
    } else {
      const newColumnConfig: ColumnConfig = {};
      this.tableColumns.forEach(({ id = '' }) => {
        set(newColumnConfig, `${id}.hidden`, true);
      });

      this.columnConfig = newColumnConfig;
    }
  }

  @action
  setColumnConfig = (newConfig: Partial<FormTableConfig>, id: string): void => {
    this.columnConfig = { ...set(this.columnConfig, id, { ...this.columnConfig[id], ...newConfig }) };
  }

  @action
  setTableColumns = (tableColumns: UnionColumns<any>[]): void => {
    this.columnConfig = {};
    this.tableColumns = tableColumns;
  }

  @action
  fetchFormDataList = (params: Params): void => {
    if (!this.allowRequestData || !this.pageID) {
      return;
    }

    this.listLoading = true;
    const { condition = [], tag = 'must', ...other } = params;
    const { condition: frontCondition = [], tag: frontTag } = this.filterConfig || {};
    fetchFormDataList(this.appID, this.pageID, {
      query: toEs({ tag: frontTag || tag, condition: [...condition, ...frontCondition] }),
      sort: [],
      ...other,
    }).then((res) => {
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
