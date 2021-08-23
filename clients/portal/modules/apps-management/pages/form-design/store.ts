import { History } from 'history';
import { action, observable, reaction, IReactionDisposer, computed, toJS } from 'mobx';
import { UnionColumns } from 'react-table';
import { set } from 'lodash';

import logger from '@lib/logger';
import toast from '@lib/toast';
import { getTableSchema, saveTableSchema } from '@lib/http-client';
import { schemaToMap } from '@lib/schema-convert';

import FormStore from '@c/form-builder/store';
import AppPageDataStore from '@c/form-app-data-table/store';
import { TableConfig } from '@c/form-app-data-table/type';
import { setFixedParameters } from '@c/form-app-data-table/utils';
import registry from '@c/form-builder/registry';

import { createPageScheme } from './api';

export const SHOW_FIELD = [
  'DatePicker',
  'Input',
  'MultipleSelect',
  'NumberPicker',
  'RadioGroup',
  'Select',
  'CheckboxGroup',
  'UserPicker',
  'CascadeSelector',
  'OrganizationPicker',
  'AssociatedData',
  'Serial',
];

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer;
  destroySetTableColumn: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  destroySetFilters: IReactionDisposer;
  destroySetAllFilter: IReactionDisposer;
  destroySetSchema: IReactionDisposer;
  @observable pageID = '';
  @observable pageName = '';
  @observable appID = '';
  @observable saveSchemeLoading = false;
  @observable appPageStore = new AppPageDataStore({ schema: {} });
  @observable pageLoading = true;
  @observable formStore: FormStore | null = null;
  @observable hasSchema = false;
  @observable initScheme: ISchema = {};
  @observable pageTableColumns: string[] = [];
  @observable pageTableShowRule: TableConfig = { order: '-created_at', pageSize: 10 };
  @observable filters: Filters = [];
  @observable filterModalVisible = false;

  @computed get fieldsMap(): Record<string, SchemaFieldItem> {
    return schemaToMap(this.formStore?.schema) || {};
  }

  @computed get fieldList(): PageField[] {
    const whitInternalFields = Object.assign({}, this.fieldsMap, this.internalFields);

    return Object.entries(whitInternalFields).filter(([key, fieldSchema]) => {
      return (key !== '_id' && SHOW_FIELD.includes(fieldSchema['x-component'] as string));
    }).map(([key, fieldSchema]) => {
      return {
        id: key,
        label: (fieldSchema.title || '') as string,
        type: fieldSchema.type || '',
        enum: fieldSchema.enum as EnumItem[],
        isSystem: fieldSchema['x-internal']?.isSystem ? true : false,
        cProps: fieldSchema['x-component-props'],
        xComponent: fieldSchema['x-component'] as string,
      };
    });
  }

  @computed get internalFields(): Record<string, ISchema> {
    const _internalFields = this.formStore?.internalFields.reduce<Record<string, ISchema>>((acc, field) => {
      const { fieldName, componentName, configValue } = field;
      const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
      if (!toSchema) {
        logger.error(`failed to find component: [${componentName}] in registry`);
      }

      const currentSchema = toSchema(toJS(configValue));
      acc[fieldName] = set(currentSchema, 'x-internal.isSystem', true);

      return acc;
    }, {});

    return _internalFields || {};
  }

  @computed get showAllFields(): boolean {
    return this.fieldList.length === this.pageTableColumns.length;
  }

  @computed get indeterminateOfSelectedAllColumns(): boolean {
    if (!this.pageTableColumns.length) {
      return false;
    }

    if (this.pageTableColumns.length === this.fieldList.length) {
      return false;
    }

    return true;
  }

  constructor() {
    this.destroyFetchScheme = reaction(() => {
      return { pageID: this.pageID, appID: this.appID };
    }, this.fetchFormScheme);

    this.destroySetAllFilter = reaction(() => this.fieldList, () => {
      if (!this.formStore) {
        return;
      }

      if (!this.hasSchema && !this.pageTableColumns.length) {
        this.pageTableColumns = this.fieldList.map(({ id }) => id).sort((key1, key2) => {
          return this.fieldsMap?.[key1]?.['x-index'] || 0 - (this.fieldsMap?.[key2]?.['x-index'] || 0);
        });
      } else {
        this.pageTableColumns = this.pageTableColumns.filter((id) => {
          if (!this.formStore?.schema?.properties) {
            return false;
          }

          return id in this.formStore?.schema?.properties;
        });
      }

      this.filters = this.filters.filter((id) => {
        if (!this.formStore?.schema?.properties) {
          return false;
        }

        return id in this.formStore?.schema?.properties;
      });
    });

    this.destroySetSchema = reaction(() => this.formStore?.schema, this.appPageStore.setSchema);
    this.destroySetFilters = reaction(() => this.filters, this.appPageStore.setFilters);

    this.destroySetTableColumn = reaction((): UnionColumns<any>[] => {
      if (!this.pageTableColumns) {
        return [];
      }
      const column: UnionColumns<any>[] = this.pageTableColumns.map((key) => {
        return {
          id: key,
          Header: { ...this.fieldsMap, ...this.internalFields }[key]?.title || '',
          accessor: key,
        };
      });

      return setFixedParameters(
        this.pageTableShowRule.fixedRule,
        [...column, { id: 'action', Header: '操作', accessor: 'action' }],
      );
    }, this.appPageStore.setTableColumns);

    this.destroySetTableConfig = reaction(() => {
      return this.pageTableShowRule;
    }, this.appPageStore.setTableConfig);
  }

  toggleShowAllFields(isShowAll: boolean): void {
    if (isShowAll) {
      this.setPageTableColumns(this.fieldList.map(({ id }) => id));
      return;
    }

    this.setPageTableColumns([]);
  }

  toggleTableColumn(fieldKey: string, isShow: boolean): void {
    if (isShow) {
      this.setPageTableColumns([...this.pageTableColumns, fieldKey]);
      return;
    }

    this.setPageTableColumns(this.pageTableColumns.filter((id) => id !== fieldKey));
  }

  @action
  setFilters = (filters: Filters): void => {
    this.filters = filters;
  }

  @action
  setPageID = (pageID: string): void => {
    this.pageID = pageID;
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  }

  @action
  setPageTableColumns = (values: string[]): void => {
    this.pageTableColumns = values;
  }

  @action
  setPageTableShowRule = (newRule: TableConfig): void => {
    this.pageTableShowRule = { ...this.pageTableShowRule, ...newRule };
  }

  @action
  reSetFormScheme = (): void => {
    this.formStore = new FormStore({ schema: this.initScheme, appID: this.appID, pageID: this.pageID });
  }

  @action
  fetchFormScheme = ({ pageID, appID }: { pageID: string, appID: string }): void => {
    if (!pageID || !appID) {
      return;
    }

    this.pageLoading = true;
    getTableSchema(appID, pageID).then((res) => {
      const { schema = {}, config = {} } = res || {};
      this.hasSchema = !!res;
      this.initScheme = schema;
      this.formStore = new FormStore({ schema, appID, pageID });
      this.pageTableColumns = config.pageTableColumns || [];
      this.filters = config.filters || [];
      if (config.pageTableShowRule) {
        this.pageTableShowRule = config.pageTableShowRule;
        if (!this.pageTableShowRule.order) this.pageTableShowRule.order = '-created_at';
      }
      this.pageLoading = false;
    }).catch(() => {
      this.pageLoading = false;
    });
  }

  @action
  saveFormSchema = async (history: History): Promise<any> => {
    // validate table schema on each field
    if (!this.formStore?.validate()) {
      return Promise.resolve(false);
    }

    if (this.formStore?.fields.length && this.pageTableColumns && this.pageTableColumns.length === 0) {
      toast.error('请在页面配置-字段显示和排序至少选择一个字段显示');
      history.replace(`/apps/formDesign/pageSetting/${this.pageID}/${this.appID}`);
      return Promise.resolve(false);
    }

    this.saveSchemeLoading = true;

    const allSchema = {
      ...this.formStore.schema,
      title: this.pageName,
      properties: {
        ...this.formStore?.schema?.properties,
        ...this.internalFields,
      },
    };

    try {
      await saveTableSchema(this.appID, this.pageID, allSchema || {});
      createPageScheme(this.appID, {
        tableID: this.pageID, config: {
          pageTableColumns: this.pageTableColumns,
          filters: this.filters,
          pageTableShowRule: this.pageTableShowRule,
        },
      });
      toast.success(this.hasSchema ? '保存成功!' : '创建成功!');
      (this.formStore as FormStore).hasEdit = false;
      this.initScheme = this.formStore?.schema as ISchema;
      this.saveSchemeLoading = false;
      return true;
    } catch (error) {
      toast.error(error.message);
      this.saveSchemeLoading = false;
    }
  }

  @action
  clear = (): void => {
    this.pageID = '';
    this.formStore = null;
    this.pageTableColumns = [];
    this.pageTableShowRule = { order: '-created_at', pageSize: 10 };
    this.filters = [];
    this.appPageStore.clear();
  }

  @action
  savePageConfig = (): void => {
    if (this.pageTableColumns && this.pageTableColumns.length === 0) {
      toast.error('请在页面配置-字段显示和排序至少选择一个字段显示');
      return;
    }

    createPageScheme(this.appID, {
      tableID: this.pageID, config: {
        pageTableColumns: this.pageTableColumns,
        filters: this.filters,
        pageTableShowRule: this.pageTableShowRule,
      },
    }).then(() => {
      toast.success('保存成功!');
    });
  }
}

export default new FormDesignStore();
