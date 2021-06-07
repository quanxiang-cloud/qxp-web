import { action, observable, reaction, IReactionDisposer, computed, toJS } from 'mobx';
import { UnionColumns } from 'react-table';

import FormStore from '@c/form-builder/store';
import toast from '@lib/toast';
import AppPageDataStore from '@c/form-app-data-table/store';
import { PageTableShowRule, setFixedParameters } from '@c/form-app-data-table/utils';

import { getTableSchema, saveTableSchema } from '@lib/http-client';
import {
  createPageScheme,
} from './api';

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer;
  destroySetTableColumn: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  destroySetFilters: IReactionDisposer;
  destroySetAllFilter: IReactionDisposer;
  destroySetSchema: IReactionDisposer;
  @observable pageID = '';
  @observable appID = '';
  @observable saveSchemeLoading = false;
  @observable appPageStore = new AppPageDataStore({ schema: {} });
  @observable initScheme = {};
  @observable pageLoading = true;
  @observable formStore: FormStore | null = null;
  @observable hasSchema = false;
  @observable pageTableColumns: string[] = [];
  @observable pageTableShowRule: PageTableShowRule = {};
  @observable filterMaps: FilterMaps = {};

  @computed get fieldsMap(): Record<string, ISchema> {
    return this.formStore?.schema?.properties || {};
  }

  @computed get fieldList(): PageField[] {
    if (!this.pageTableColumns) {
      this.pageTableColumns = Object.keys(this.fieldsMap);
    }

    return Object.entries(toJS(this.fieldsMap)).filter(([key, fieldSchema]) => {
      if (key === '_id' || fieldSchema.type === 'array') {
        return false;
      }

      return true;
    }).map(([key, fieldSchema]) => {
      return {
        id: key,
        label: (fieldSchema.title || '') as string,
        type: fieldSchema.type || '',
        // todo fix this type cast
        enum: fieldSchema.enum as EnumItem[],
        isSystem: fieldSchema['x-internal']?.isSystem ? true : false,
        cProps: fieldSchema['x-component-props'],
      };
    });
  }

  constructor() {
    this.destroyFetchScheme = reaction(() => {
      return { pageID: this.pageID, appID: this.appID };
    }, this.fetchFormScheme);

    this.destroySetAllFilter = reaction(() => this.fieldList, () => {
      if (!this.formStore) {
        return;
      }

      const hasFilterMaps = { ...this.filterMaps };
      Object.keys(this.filterMaps).forEach((id) => {
        if (this.formStore?.schema?.properties && !(id in this.formStore?.schema?.properties)) {
          delete hasFilterMaps[id];
        }
      });
      this.filterMaps = hasFilterMaps;
    });

    this.destroySetSchema = reaction(() => this.formStore?.schema, this.appPageStore.setSchema);
    this.destroySetFilters = reaction(() => this.filterMaps, this.appPageStore.setFilters);

    this.destroySetTableColumn = reaction(() => {
      const column: UnionColumns<any>[] = this.pageTableColumns.map((key)=>{
        return {
          id: key,
          Header: this.fieldsMap[key].title as string,
          accessor: key,
        };
      });
      return setFixedParameters(this.pageTableShowRule.fixedRule, column);
    }, this.appPageStore.setTableColumns);

    this.destroySetTableConfig = reaction(() => {
      return this.pageTableShowRule;
    }, this.appPageStore.setTableConfig);
  }

  @action
  setFilterMaps = (filters: FilterMaps) => {
    this.filterMaps = filters;
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  setAppID = (appID: string) => {
    this.appID = appID;
  }

  @action
  setPageTableColumns = (values: string[]) => {
    this.pageTableColumns = values;
  }

  @action
  setPageTableShowRule = (newRule: PageTableShowRule) => {
    this.pageTableShowRule = { ...this.pageTableShowRule, ...newRule };
  }

  @action
  reSetFormScheme = () => {
    this.formStore = new FormStore({ schema: this.initScheme, appID: this.appID, pageID: this.pageID });
  }

  @action
  fetchFormScheme = ({ pageID, appID }: { pageID: string, appID: string }) => {
    if (!pageID || !appID) {
      return;
    }

    this.pageLoading = true;
    getTableSchema(appID, pageID).then((res) => {
      const { schema = {}, config = {} } = res || {};
      this.hasSchema = res ? true : false;
      this.initScheme = schema;
      this.formStore = new FormStore({ schema, appID, pageID });
      this.pageTableColumns = config.pageTableColumns;
      this.filterMaps = config.filters || [];
      this.pageTableShowRule = config.pageTableShowRule || {};
      this.pageLoading = false;
    }).catch(() => {
      this.pageLoading = false;
    });
  }

  @action
  saveFormScheme = () => {
    this.saveSchemeLoading = true;
    return saveTableSchema(this.appID, this.pageID, this.formStore?.schema || {}).then(() => {
      createPageScheme(this.appID, {
        tableID: this.pageID, config: {
          pageTableColumns: this.pageTableColumns,
          filter: this.filterMaps,
          pageTableShowRule: this.pageTableShowRule,
        },
      });
      toast.success(this.hasSchema ? '保存成功!' : '创建成功!');
      this.saveSchemeLoading = false;
    }).catch(() => {
      this.saveSchemeLoading = false;
    });
  }

  @action
  clear = () => {
    this.pageID = '';
    this.formStore = null;
    this.pageTableColumns = [];
    this.pageTableShowRule = {};
    this.filterMaps = {};
    this.appPageStore.clear();
  }

  @action
  savePageConfig = () => {
    createPageScheme(this.appID, {
      tableID: this.pageID, config: {
        pageTableColumns: this.pageTableColumns,
        filter: this.filterMaps,
        pageTableShowRule: this.pageTableShowRule,
      },
    }).then(() => {
      toast.success('保存成功!');
    });
  }
}

export default new FormDesignStore();
