export type SubTableConfig = {
  title: string;
  description: string;
  subordination: string;
  subTableSchema: ISchema;
  required: boolean;
  linkedTable: {
    appID: string;
    tableID: string;
    tableName: string;
  }
  subTableColumns: string[];
}

export const defaultConfig: SubTableConfig = {
  title: '子表单',
  description: '子表单的描述内容',
  subordination: 'sub_table',
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
  subTableColumns: [],
};

export function toSchema(value: SubTableConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    display: true,
    items: value.subTableSchema,
    'x-component': 'SubTable',
    ['x-component-props']: {
      columns: value.subTableColumns || [],
      subordination: value.subordination,
      appID: value.linkedTable?.appID,
      tableID: value.linkedTable?.tableID,
      tableName: value.linkedTable?.tableName,
    },
    ['x-internal']: {
      permission: 3,
      sortable: false,
    },
  };
}

export function toConfig(schema: ISchema): SubTableConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    subordination: schema['x-component-props']?.subordination,
    subTableSchema: schema.items as ISchema,
    required: !!schema.required,
    linkedTable: {
      appID: schema['x-component-props']?.appID,
      tableID: schema['x-component-props']?.tableID,
      tableName: schema['x-component-props']?.tableName,
    },
    subTableColumns: schema['x-component-props']?.columns,
  };
}
