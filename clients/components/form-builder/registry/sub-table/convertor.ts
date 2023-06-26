import { getDisplayModifierFromSchema, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export type Layout = 'default' | 'one' | 'two' | 'three';

export type SubTableConfig = {
  title: string;
  description: string;
  rowLimit: string;
  layout: Layout;
  subordination: string;
  subTableSchema: ISchema;
  displayModifier: FormBuilder.DisplayModifier;
  required: boolean;
  linkedTable: {
    appID: string;
    tableID: string;
    tableName: string;
  }
  subTableColumns?: string[];
  tableID?: string;
  defaultAddAllAssociatedData?: boolean;
}

export const defaultConfig: SubTableConfig = {
  title: '子表单',
  rowLimit: 'multiple',
  layout: 'default',
  description: '',
  subordination: 'sub_table',
  displayModifier: 'normal',
  subTableSchema: {
    type: 'object',
    properties: {},
  },
  required: false,
  linkedTable: {
    appID: '',
    tableID: '',
    tableName: '',
  },
  subTableColumns: undefined,
  tableID: '',
  defaultAddAllAssociatedData: false,
};

export function toSchema(value: SubTableConfig): ISchema {
  const isFromLinkedTable = value.subordination === 'foreign_table';
  const rules = value.required ? [{ min: 1 }] : [];

  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    items: isFromLinkedTable ? undefined : value.subTableSchema,
    'x-component': 'SubTable',
    'x-rules': rules,
    ['x-component-props']: {
      columns: value.subTableColumns,
      subordination: value.subordination,
      appID: value.linkedTable?.appID,
      tableID: isFromLinkedTable ? value.linkedTable?.tableID : value.tableID,
      tableName: value.linkedTable?.tableName,
      rowLimit: value.rowLimit,
      layout: value.layout,
      defaultAddAllAssociatedData: value.defaultAddAllAssociatedData,
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(value),
      sortable: false,
    },
  };
}

export function toConfig(schema: ISchema): SubTableConfig {
  const isFromLinkedTable = schema?.['x-component-props']?.subordination === 'foreign_table';
  const tableID = schema['x-component-props']?.tableID;
  return {
    title: schema.title as string,
    description: schema.description as string,
    rowLimit: schema['x-component-props']?.rowLimit,
    layout: schema['x-component-props']?.layout,
    subordination: schema['x-component-props']?.subordination,
    displayModifier: getDisplayModifierFromSchema(schema),
    subTableSchema: schema.items as ISchema,
    required: !!schema.required,
    linkedTable: {
      appID: schema['x-component-props']?.appID,
      tableID: isFromLinkedTable ? tableID : '',
      tableName: schema['x-component-props']?.tableName,
    },
    subTableColumns: schema['x-component-props']?.columns,
    tableID: !isFromLinkedTable ? tableID : '',
    defaultAddAllAssociatedData: schema['x-component-props']?.defaultAddAllAssociatedData,
  };
}
