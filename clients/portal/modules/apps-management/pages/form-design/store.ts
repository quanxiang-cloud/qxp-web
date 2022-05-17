import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';
import { UnionColumn } from 'react-table';
import { values, map } from 'ramda';

import toast from '@lib/toast';
import FormStore from '@c/form-builder/store';
import { schemaToMap } from '@lib/schema-convert';
import AppPageDataStore from '@c/form-app-data-table/store';
import { getTableSchema, saveTableSchema } from '@lib/http-client';
import { SYSTEM_FIELDS, INVALID_INVISIBLE } from '@c/form-builder/constants';
import { TableConfig, TableColumnConfig } from '@c/form-app-data-table/type';
import { numberTransform, validatePageConfig, validateFieldConfig } from '@c/form-builder/utils';
import {
  setFixedParameters,
  columnStringToObject,
  DEFAULT_COLUMN_WIDTH,
  SHOW_FIELD,
} from '@c/form-app-data-table/utils';

import { createPageSchema } from './api';

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
  @observable pageTableColumns: TableColumnConfig[] = [];
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

  @computed get allSchema(): ISchema {
    const indexes = values(this.formStore?.schema?.properties || {}).map(numberTransform);
    let maxIndex = Math.max(...indexes);
    maxIndex = Number.isFinite(maxIndex) ? maxIndex : 0;
    const internalFieldMapper = (field: ISchema): ISchema => {
      maxIndex += 1;
      return { ...field, 'x-index': maxIndex };
    };
    return {
      ...this.formStore?.schema,
      title: this.pageName,
      properties: {
        ...this.formStore?.schema?.properties,
        ...map<Record<string, ISchema>, Record<string, ISchema>>(internalFieldMapper, this.internalFields),
      },
    };
  }

  @computed get internalFields(): Record<string, ISchema> {
    let innerFieldIndex: number = this.formStore?.flattenFields.length || 0;

    const _internalFields = this.formStore?.internalFields.reduce<Record<string, ISchema>>((acc, field) => {
      const { componentName, configValue, fieldName } = field;
      const fieldId = fieldName;
      if (fieldId) {
        acc[fieldId] = {
          display: false,
          readOnly: false,
          title: configValue.title,
          type: configValue.type,
          'x-index': innerFieldIndex += 1,
          'x-component': componentName,
          'x-component-props': configValue['x-component-props'],
          'x-internal': {
            permission: INVALID_INVISIBLE,
            isSystem: configValue.isSystem,
          },
        };
      }
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
    this.appPageStore.canSetColumnWidth = false;
    this.destroyFetchScheme = reaction(() => {
      return { pageID: this.pageID, appID: this.appID };
    }, this.fetchFormScheme);

    let fieldListIdCache: string[] = this.fieldList.map(({ id }) => id);
    this.destroySetAllFilter = reaction(() => this.fieldList, () => {
      if (!this.formStore) {
        return;
      }

      const newFieldListIds = this.fieldList
        .map(({ id }) => id)
        .filter((id) => !SYSTEM_FIELDS.includes(id) && !fieldListIdCache.includes(id));

      if (newFieldListIds.length) {
        this.pageTableColumns = [...this.pageTableColumns, ...columnStringToObject(newFieldListIds)];
      }

      this.pageTableColumns = this.pageTableColumns.filter(({ id }) => {
        return this.judgeInSchema(id);
      });

      this.filters = this.filters.filter((id) => {
        return this.judgeInSchema(id);
      });

      fieldListIdCache = this.fieldList.map(({ id }) => id);
    });

    this.destroySetSchema = reaction(() => this.allSchema, this.appPageStore.setSchema);
    this.destroySetFilters = reaction(() => this.filters, this.appPageStore.setFilters);

    this.destroySetTableColumn = reaction((): UnionColumn<any>[] => {
      if (!this.pageTableColumns) {
        return [];
      }

      const column: UnionColumn<any>[] = this.pageTableColumns.map(({ id, width }) => {
        return {
          id,
          Header: { ...this.fieldsMap, ...this.internalFields }[id]?.title || '',
          accessor: id,
          width: width || DEFAULT_COLUMN_WIDTH,
        };
      });

      return setFixedParameters(
        this.pageTableShowRule.fixedRule,
        [...column, { id: 'action', Header: '操作', accessor: 'action', fixed: true, width: 100 }],
      );
    }, this.appPageStore.setTableColumns);

    this.destroySetTableConfig = reaction(() => {
      return this.pageTableShowRule;
    }, this.appPageStore.setTableConfig);
  }

  @action
  judgeInSchema = (key: string): boolean => {
    return SYSTEM_FIELDS.includes(key) || key in this.fieldsMap;
  };

  @action
  toggleShowAllFields(isShowAll: boolean): void {
    if (isShowAll) {
      this.pageTableColumns = this.fieldList.reduce((acc, col) => {
        if (this.pageTableColumns.findIndex(({ id }) => id === col.id) === -1) {
          return [...acc, { id: col.id }];
        }

        return acc;
      }, this.pageTableColumns);
      return;
    }

    this.pageTableColumns = [];
  }

  @action
  tableColumnController = (column: TableColumnConfig, type: TableColumnAction): void => {
    switch (type) {
    case 'edit': {
      this.pageTableColumns = this.pageTableColumns.map((_column) => {
        if (column.id === _column.id) {
          return column;
        }

        return _column;
      });
    }
      break;
    case 'del':
      this.pageTableColumns = this.pageTableColumns.filter(({ id }) => id !== column.id);
      break;
    case 'add':
      this.pageTableColumns = [...this.pageTableColumns, column];
      break;
    }
  };

  @action
  setFilters = (filters: Filters): void => {
    this.filters = filters;
  };

  @action
  setPageID = (pageID: string): void => {
    this.pageID = pageID;
  };

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  pageTableColumnsSort = (values: string[]): void => {
    this.pageTableColumns = values.map((id) => {
      return this.pageTableColumns.find((column) => id === column.id) as TableColumnConfig;
    });
  };

  @action
  setPageTableShowRule = (newRule: TableConfig): void => {
    this.pageTableShowRule = { ...this.pageTableShowRule, ...newRule };
  };

  @action
  fetchFormScheme = ({ pageID, appID }: { pageID: string, appID: string }): void => {
    if (!pageID || !appID) {
      return;
    }

    this.pageLoading = true;
    getTableSchema(appID, pageID).then((res) => {
      const { schema = {}, config = {} } = res || {};
      this.hasSchema = !!res;
      this.formStore = new FormStore({ schema, appID, pageID });
      this.pageTableColumns = columnStringToObject(config.pageTableColumns || []);
      this.filters = config.filters || [];
      if (config.pageTableShowRule) {
        this.pageTableShowRule = config.pageTableShowRule;
        if (!this.pageTableShowRule.order) this.pageTableShowRule.order = '-created_at';
      }
      this.pageLoading = false;
    }).catch(() => {
      this.pageLoading = false;
    });
  };

  @action
  saveForm = async (): Promise<void | boolean> => {
    try {
      await validateFieldConfig(this.formStore?.fieldConfigValidator, this.formStore?.getFieldValueFunc);
      await validatePageConfig(this.formStore?.flattenFields.length || 0, this.pageTableColumns?.length);
      await this.saveFormConfig();
    } catch (err) {
      toast.error(err);
      return false;
    }
  };

  @action
  saveFormConfig = async (): Promise<any> => {
    this.saveSchemeLoading = true;
    return saveTableSchema(this.appID, this.pageID, this.allSchema || {}).then(() => {
      return createPageSchema(this.appID, {
        tableID: this.pageID, config: {
          pageTableColumns: this.pageTableColumns,
          filters: this.filters,
          pageTableShowRule: this.pageTableShowRule,
        },
      });
    }).then(() => {
      toast.success(this.hasSchema ? '保存成功!' : '创建成功!');
    }).finally(() => {
      this.saveSchemeLoading = false;
      (this.formStore as FormStore).hasEdit = false;
      this.formStore?.setSerialFieldIds(this.formStore.schema);
    });
  };

  @action
  clear = (): void => {
    this.pageID = '';
    this.formStore = null;
    this.pageTableColumns = [];
    this.pageTableShowRule = { order: '-created_at', pageSize: 10 };
    this.filters = [];
    this.appPageStore.clear();
  };
}

export default new FormDesignStore();
