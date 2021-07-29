export interface AggregationRecordsConfig {
  title: string;
  description: string;
  displayModifier: FormBuilder.DisplayModifier;
  linkedTable: {
    appID?: string;
    tableID: string;
    tableName: string;
    associatedTable?: ISchema;
  };
  aggType: 'count' | 'sum' | 'max' | 'min' | 'avg';
  linkedField: {
    fieldName: string;
  };
  decimalPlaces: number;
  roundDecimal: 'rounding' | 'round-up' | 'round-down';
  displayFieldNull: '0' | 'null';
  dataRange: 'all' | 'part';
  required: boolean,
}

export const defaultConfig: AggregationRecordsConfig = {
  title: '统计',
  description: '',
  displayModifier: 'readonly',
  linkedTable: {
    appID: '',
    tableID: '',
    tableName: '',
    associatedTable: undefined,
  },
  aggType: 'count',
  linkedField: {
    fieldName: '',
  },
  decimalPlaces: 0,
  roundDecimal: 'rounding',
  displayFieldNull: '0',
  dataRange: 'all',
  required: true,
};

export function toSchema(value: AggregationRecordsConfig): ISchema {
  return {
    type: 'number',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'AggregationRecords',
    ['x-component-props']: {
      appID: value?.linkedTable?.appID,
      tableID: value?.linkedTable?.tableID,
      tableName: value?.linkedTable?.tableName,
      fieldName: value?.linkedField?.fieldName,
      associatedTable: value.linkedTable.associatedTable,
      aggType: value.aggType,
      decimalPlaces: value.decimalPlaces,
      roundDecimal: value.roundDecimal,
      displayFieldNull: value.displayFieldNull,
      dataRange: value.dataRange,
    },
    ['x-internal']: {
      permission: 3,
      defaultValueFrom: 'customized',
    },
  };
}

export function toConfig(schema: ISchema): AggregationRecordsConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else {
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
    aggType: schema['x-component-props']?.aggType,
    linkedField: {
      fieldName: schema['x-component-props']?.fieldName,
    },
    decimalPlaces: schema['x-component-props']?.decimalPlaces,
    roundDecimal: schema['x-component-props']?.roundDecimal,
    displayFieldNull: schema['x-component-props']?.displayFieldNull,
    dataRange: schema['x-component-props']?.dataRange,
    required: !!schema.required,
  };
}
