import { getDisplayModifierFromSchema, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface AssociatedRecordsConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  linkedTable: {
    appID?: string;
    tableID: string;
    tableName: string;
    associatedTable?: ISchema;
  } | undefined;
  multiple: boolean;
  enableFilter: boolean;
  filter?: {
    ruleJoinOperator: 'every' | 'some';
    rules: Array<FormBuilder.FormDataFilterRule>;
  };
  columns: string[];
  required: boolean;
  filterConfig?: FilterConfig;
  mergeConfig?: any;
  defaultValueLinkage?: FormBuilder.DefaultValueLinkage;
}

export const defaultConfig: AssociatedRecordsConfig = {
  title: '关联记录',
  description: '',
  displayModifier: 'normal',
  linkedTable: undefined,
  multiple: false,
  enableFilter: false,
  filter: undefined,
  columns: [],
  required: false,
  defaultValueLinkage: undefined,
};

export function toSchema(value: AssociatedRecordsConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    items: { type: 'string' },
    'x-component': 'AssociatedRecords',
    ['x-component-props']: {
      appID: value?.linkedTable?.appID,
      tableID: value?.linkedTable?.tableID,
      tableName: value?.linkedTable?.tableName,
      multiple: !!value.multiple,
      columns: value.columns || [],
      associatedTable: value.linkedTable?.associatedTable,
      filterConfig: value.filterConfig || null,
      mergeConfig: value.mergeConfig || null,
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(value),
      defaultValueLinkage: value.defaultValueLinkage,
      defaultValueFrom: 'linkage',
    },
  };
}

export function toConfig(schema: ISchema): AssociatedRecordsConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    linkedTable: {
      appID: schema['x-component-props']?.appID,
      tableID: schema['x-component-props']?.tableID,
      tableName: schema['x-component-props']?.tableName,
      associatedTable: schema['x-component-props']?.associatedTable,
    },
    multiple: !!schema['x-component-props']?.multiple,
    enableFilter: !schema['x-component-props']?.filter,
    filter: schema['x-component-props']?.filter,
    columns: schema['x-component-props']?.columns || [],
    required: !!schema.required,
    filterConfig: schema['x-component-props']?.filterConfig || null,
    mergeConfig: schema['x-component-props']?.mergeConfig || null,
    defaultValueLinkage: schema['x-internal']?.defaultValueLinkage,
  };
}
