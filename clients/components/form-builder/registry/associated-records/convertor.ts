export interface AssociatedRecordsConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  linkedTable: {
    appID?: string;
    tableID: string;
    tableName: string;
    associatedTable?: ISchema;
  };
  multiple: boolean;
  enableFilter: boolean;
  filter?: {
    ruleJoinOperator: 'every' | 'some';
    rules: Array<FormBuilder.FormDataFilterRule>;
  };
  columns: string[];
  required: boolean;
}

export const defaultConfig: AssociatedRecordsConfig = {
  title: '关联记录',
  description: '',
  displayModifier: 'normal',
  linkedTable: {
    appID: '',
    tableID: '',
    tableName: '',
    associatedTable: undefined,
  },
  multiple: false,
  enableFilter: false,
  filter: undefined,
  columns: [],
  required: false,
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
      associatedTable: value.linkedTable.associatedTable,
    },
    ['x-internal']: {
      permission: 3,
      defaultValueFrom: 'customized',
    },
  };
}

export function toConfig(schema: ISchema): AssociatedRecordsConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: displayModifier,
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
  };
}
