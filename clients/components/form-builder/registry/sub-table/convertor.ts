export type SubTableConfig = {
  title: string;
  description: string;
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
}

export const defaultConfig: SubTableConfig = {
  title: '子表单',
  description: '子表单的描述内容',
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
};

export function toSchema(value: SubTableConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    display: value.displayModifier !== 'hidden',
    items: value.subTableSchema,
    'x-component': 'SubTable',
    ['x-component-props']: {
      columns: value.subordination === 'foreign_table' ? value.subTableColumns || [] : [],
      subordination: value.subordination,
      appID: value.linkedTable?.appID,
      tableID: value.linkedTable?.tableID || value.tableID,
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
    displayModifier: schema.display ? 'normal' : 'hidden',
    subTableSchema: schema.items as ISchema,
    required: !!schema.required,
    linkedTable: {
      appID: schema['x-component-props']?.appID,
      tableID: schema['x-component-props']?.tableID,
      tableName: schema['x-component-props']?.tableName,
    },
    subTableColumns: schema['x-component-props']?.columns,
    tableID: schema['x-component-props']?.tableID,
  };
}
