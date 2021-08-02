export type AggType = 'count' | 'sum' | 'max' | 'min' | 'avg';
export type RoundMethod = 'round' | 'round-up' | 'round-down';

export interface AggregationRecordsConfig {
  title: string;
  description: string;
  displayModifier: FormBuilder.DisplayModifier;
  associateObject: {
    appID: string;
    tableID: string;
    sourceFieldId: string;
  };
  aggType: AggType;
  fieldName: string;
  decimalPlaces: number;
  roundDecimal: RoundMethod;
  displayFieldNull: '0' | '-';
  dataRange: 'all' | 'part';
}

export const defaultConfig: AggregationRecordsConfig = {
  title: '统计',
  description: '',
  displayModifier: 'readonly',
  associateObject: {
    appID: '',
    tableID: '',
    sourceFieldId: '',
  },
  aggType: 'count',
  fieldName: '',
  decimalPlaces: 0,
  roundDecimal: 'round',
  displayFieldNull: '0',
  dataRange: 'all',
};

export function toSchema(value: AggregationRecordsConfig): ISchema {
  return {
    type: 'number',
    title: value.title,
    description: value.description,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'AggregationRecords',
    ['x-component-props']: {
      appID: value.associateObject?.appID,
      tableID: value.associateObject?.tableID,
      sourceFieldId: value.associateObject?.sourceFieldId,
      fieldName: value.fieldName,
      aggType: value.aggType,
      decimalPlaces: value.decimalPlaces,
      roundDecimal: value.roundDecimal,
      displayFieldNull: value.displayFieldNull,
      dataRange: value.dataRange,
    },
    ['x-internal']: {
      permission: 3,
    },
  };
}

export function toConfig(schema: ISchema): AggregationRecordsConfig {
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
    associateObject: {
      appID: schema['x-component-props']?.appID,
      tableID: schema['x-component-props']?.tableID,
      sourceFieldId: schema['x-component-props']?.sourceFieldId,
    },
    aggType: schema['x-component-props']?.aggType,
    fieldName: schema['x-component-props']?.fieldName,
    decimalPlaces: schema['x-component-props']?.decimalPlaces,
    roundDecimal: schema['x-component-props']?.roundDecimal,
    displayFieldNull: schema['x-component-props']?.displayFieldNull,
    dataRange: schema['x-component-props']?.dataRange,
  };
}
