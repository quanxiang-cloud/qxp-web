import dayjs from 'dayjs';

import { toEs } from '@c/data-filter/utils';
import { INTERNAL_FIELD_NAMES } from '@home/pages/app-details/constants';
import { FormDataRequestUpdateParamsRef } from '@lib/http-client-form';
import { Pair } from '@m/pages/approvals/types';

export const getFlowSummary = (form: any, schema: any, keyFields?: string[]): Pair[] | undefined => {
  let properties = schema?.properties;
  if (!form || !properties || !Object.keys(properties).length) return;

  properties = computeSchema(properties);
  const results: Array<Pair> = [];

  const keys = Object.keys(form);
  for (let key of keys) {
    key = key || '';
    const schemaValue = properties?.[key];
    if (!schemaValue) continue;
    if (keyFields && keyFields?.length) {
      if (!keyFields.includes(key)) continue;
    } else {
      if (INTERNAL_FIELD_NAMES.includes(key)) continue;
    }
    const formValue = form[key];
    if (!formValue || (Array.isArray(formValue) && !formValue.length)) continue;
    const value = getBasicValue(schemaValue, formValue);
    results.push({ key: properties?.[key]?.title || key, value, index: schemaValue?.['x-index'] || 0 });
  }
  if (results.length < 1) return;
  results.sort((a, b) => a.index - b.index);
  return results;
};

/**
 * Move the normal components out of layout components.
 * And merge them into a schema's top level.
 * @param {Record<string, any>} properties origin schema properties,
 *                   make sure it is not empty.
 *
 * @param {function} formatter the filter and mapper
 * @return {Record<string, any>} schema, the schema computed, AKA return value.
 */
export function computeSchema(
  properties: Record<string, any>,
  formatter?: (schemaItem: any) => any,
): Record<string, any> {
  let schemaComputed: Record<string, any> = {};
  Object.keys(properties).forEach((key) => {
    let value = properties[key];
    const xInternal = value['x-internal'];
    if (xInternal?.['isLayoutComponent']) {
      const p = value['properties'];
      if (p && Object.keys(p).length) {
        schemaComputed = Object.assign({}, schemaComputed, computeSchema(p, formatter));
      }
    } else if (formatter) {
      value = formatter(value);
      if (value) {
        schemaComputed[key] = value;
      }
    } else {
      schemaComputed[key] = value;
    }
  });
  return schemaComputed;
}

export function getRequestFormData(properties: Record<string, any>): Record<string, any> | undefined {
  const ref = getRequestRef(properties);
  let data: Record<string, any> | undefined;
  if (Object.keys(ref || {}).length) {
    data = { ref };
  }
  return data;
}

/**
 * Get the Flow form data or the APP form 2.0 request ref.
 * @param {Record<string, any>} properties origin schema properties,
 *                   make sure it is not empty.
 * @return {FormDataRequestUpdateParamsRef}
 */
export function getRequestRef(properties: Record<string, any>): FormDataRequestUpdateParamsRef {
  return computeSchema(
    properties,
    (schemaField) => {
      const component = schemaField?.['x-component'] || '';
      const {
        sourceFieldId,
        aggType,
        fieldName,
        condition,
        subordination,
        appID,
        tableID,
      } = schemaField?.['x-component-props'] || {};
      switch (component) {
      case 'SubTable':
        return {
          type: subordination || 'sub_table',
          appID,
          tableID,
        };
      case 'AggregationRecords':
        return {
          type: 'aggregation',
          query: condition ? toEs(condition) : null,
          tableID,
          appID,
          sourceFieldId,
          aggType,
          fieldName,
        };
      default:
        return;
      }
    },
  );
}

const datetimeValueRenderer = (schema?: any, value?: any): string => {
  const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';
  return dayjs(value as string).format(format);
};

const labelValueRenderer = (value: any): string => {
  if (Array.isArray(value)) {
    return (value as FormBuilder.Option[]).map(({ label }) => label).join(', ');
  }
  return (value as FormBuilder.Option)?.label;
};

function stringListValue(value: FormDataValue): string {
  if (!Array.isArray(value)) {
    return '';
  }

  return value.join(', ');
}

export type RoundMethod = 'round' | 'round-up' | 'round-down';

function statisticValueRender(schema?: any, value?: any): string {
  const { decimalPlaces, roundDecimal, displayFieldNull } = schema['x-component-props'] as {
    decimalPlaces: number, roundDecimal: RoundMethod, displayFieldNull: string
  };
  let method = Math.round;
  if (roundDecimal === 'round-up') {
    method = Math.ceil;
  } else if (roundDecimal === 'round-down') {
    method = Math.floor;
  }
  return method(parseFloat(value as string)).toFixed(decimalPlaces) + '' || displayFieldNull;
}

export function getBasicValue(schema: ISchema, value: FormDataValue): string {
  switch (schema?.['x-component']?.toLowerCase() || '') {
  case 'input':
  case 'numberpicker':
  case 'textarea':
  case 'radiogroup':
  case 'select':
  case 'serial':
    return value as string;
  case 'checkboxgroup':
  case 'multipleselect':
    return stringListValue(value);
  case 'datepicker':
    return datetimeValueRenderer(schema, value);
  case 'associateddata':
  case 'imageupload':
  case 'cascadeselector':
  case 'fileupload':
  case 'userpicker':
  case 'organizationpicker':
    return labelValueRenderer(value);
  case 'aggregationrecords':
    return statisticValueRender(schema, value);
  case 'associatedrecords':
    return '[关联记录]';
  case 'subtable':
    return '[子表单]';
  default:
    return value?.toString();
  }
}
