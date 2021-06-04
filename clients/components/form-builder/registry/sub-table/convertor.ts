
export type SubTableConfig = {
  title: string;
  description?: string;
  display?: FormBuilder.DisplayModifier;
  subordination: string;
  items: ISchema;
  required: boolean;
  linkedTable: {
    appID: string;
    tableID: string;
    tableName: string;
  }
  columns: {title: string; dataIndex: string}[];
}

export const defaultConfig: SubTableConfig = {
  title: '子表单',
  description: '子表单的描述内容',
  display: 'normal',
  subordination: 'foreign_table',
  linkedTable: {
    appID: '',
    tableID: '',
    tableName: '',
  },
  columns: [],
  items: {
    type: 'object',
    properties: {},
  },
  required: false,
};

export function toSchema(value: SubTableConfig): FormBuilder.Schema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.display === 'readonly',
    display: true,
    items: value.items,
    'x-component': 'SubTable',
    ['x-component-props']: {
      columns: (value.columns || []).map((v) => JSON.stringify(v)),
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

type Column = {title: string; dataIndex: string};
export function toConfig(schema: FormBuilder.Schema): SubTableConfig {
  let display: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    display = 'readonly';
  } else if (!schema.display) {
    display = 'hidden';
  }

  if (!schema['x-component-props']) {
    throw new Error('toConfig failed, x-component-props is missing in schema');
  }

  return {
    title: schema.title as string,
    description: schema.description as string,
    display,
    subordination: schema['x-component-props'].subordination,
    linkedTable: {
      appID: schema['x-component-props'].appID,
      tableID: schema['x-component-props'].tableID,
      tableName: schema['x-component-props'].tableName,
    },
    columns: schema?.['x-component-props']?.columns.map((v: string) => JSON.parse(v)) as Column[],
    items: schema.items as ISchema,
    required: !!schema.required,
  };
}
