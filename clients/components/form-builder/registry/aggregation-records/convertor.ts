import { get, has } from 'lodash';

import toast from '@lib/toast';
import { ESParameter } from '@c/data-filter/utils';
import { getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

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
  condition: ESParameter,
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
  condition: {
    bool: {
      must: [],
    },
  },
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
      condition: value.condition,
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(value),
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
    condition: schema['x-component-props']?.condition,
  };
}

export function validate(value: AggregationRecordsConfig, schema?: ISchema): boolean {
  const props = get(schema, 'properties.Fields.properties', {});
  return Object.entries(props).every(([key, conf]: [string, any]) => {
    const rules = get(conf, 'x-rules', {}) as { required?: boolean, message?: string };
    if (has(conf, 'required')) {
      Object.assign(rules, { required: conf?.required, message: `${conf?.title}不能为空` });
    }
    if (rules) {
      // check field required
      if (rules?.required) {
        const val = get(value, key);
        const valType = conf.type;
        if (valType !== 'number' && !val) {
          toast.error(rules?.message);
          return false;
        }
      }
      if (key === 'associateObject') {
        if (rules?.required && !get(value, 'associateObject.tableID')) {
          toast.error(rules?.message);
          return false;
        }
      }
      // todo: other rules
    }
    return true;
  });
}
