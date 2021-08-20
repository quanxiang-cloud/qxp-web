import { pipe, entries, map, filter, fromPairs } from 'lodash/fp';
import {
  omit, omitBy, isEmpty, Dictionary, isUndefined, transform, isEqual, isArray, isObject, values,
} from 'lodash';

import { isEmptyArray, isEmptyObject } from '@lib/utils';
import {
  FormDataRequestCreateParams,
  FormDataRequestUpdateParams,
  FormDataRequestParams,
  FormDataRequestUpdateParamsRef,
} from '@lib/http-client';

import { INTERNAL_FIELD_NAMES } from './constants';

export function difference(
  origObj: Record<string, unknown>, newObj: Record<string, unknown>,
): Record<string, any> {
  function changes(newObj: Record<string, unknown>, origObj: Record<string, unknown>): Record<string, any> {
    let arrayIndexCounter = 0;
    return transform(newObj, function(
      result: Record<string, unknown>,
      value: any,
      key,
    ) {
      if (!isEqual(value, origObj[key])) {
        // eslint-disable-next-line no-plusplus
        const resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] = (isObject(value) && isObject(origObj[key])) && !(value as any)._id ?
          changes(
            value as Record<string, unknown>,
            origObj[key] as Record<string, unknown>,
          ) : value;
      }
    });
  }
  return changes(newObj, origObj);
}

export function getOperateButtonPer(wIndex: number, authority: number) :boolean {
  const weightArr = authority.toString(2).split('').reverse();
  if (weightArr.length < 7) {
    for (let index = 0; index < 7 - weightArr.length; index += 1) {
      weightArr.push('0');
    }
  }
  if (weightArr[wIndex - 1] === '0') {
    return false;
  }

  return true;
}

function buildRequestParams(
  formData: any,
  _id: string,
  method: 'create' | 'update',
  ref?: FormDataRequestUpdateParamsRef,
): FormDataRequestCreateParams | FormDataRequestUpdateParams {
  let params: FormDataRequestCreateParams | FormDataRequestUpdateParams = {
    method,
    entity: isObject(formData) ? omit(formData, INTERNAL_FIELD_NAMES) : formData,
  };

  if (method === 'create') {
    return params;
  }

  params = {
    ...params,
    method: 'update',
    conditions: {
      condition: [{ key: '_id', op: 'eq', value: _id ? [_id] : [] }],
    },
  };

  if (ref && !isEmpty(ref)) {
    params = {
      ...params,
      ref,
    };
  }

  return params;
}

function buildSubData(
  subData: Record<string, any>, method: 'create' | 'update',
): FormDataRequestCreateParams | FormDataRequestUpdateParams {
  return buildRequestParams(
    method === 'update' ? omitBy(subData, Array.isArray) : subData,
    subData._id,
    method,
  );
}

function isSubTable(schemaMap: ISchema) {
  return (fieldKey: string): boolean => {
    return schemaMap[fieldKey as keyof ISchema]?.['x-component']?.toLowerCase() === 'subtable';
  };
}

type SubTableValue = Record<string, Array<Record<string, unknown>>>;

function parseUpdated(
  formData: SubTableValue, fieldKey: string,
): Array<FormDataRequestCreateParams | FormDataRequestUpdateParams> {
  const newData = formData[fieldKey];
  return newData.filter(({ _id }) => !!_id).map((data) => buildSubData(data, 'update'));
}

function parseDeleted(
  formData: SubTableValue, fieldKey: string, defaultValue?: SubTableValue,
): string[] {
  const newData = formData[fieldKey];
  const oldData = defaultValue?.[fieldKey] || [];

  return oldData.filter(
    ({ _id }) => !!_id && !newData.find(({ _id: id }) => id === _id),
  )?.map(({ _id }) => `${_id}`);
}

function parseNew(
  formData: SubTableValue, fieldKey: string,
): Array<FormDataRequestCreateParams | FormDataRequestUpdateParams> {
  const newData = formData[fieldKey];
  return newData.filter(({ _id }) => !_id).map((data) => buildSubData(data, 'create'));
}

function removeEmptySubTableOrAssociatedRecords<T extends Record<string, T[keyof T]>>(
  data: T, schemaMap: ISchema,
): Dictionary<T[keyof T]> {
  const valueMapper = map(([key, value]) => {
    const fieldSchema = schemaMap[key as keyof ISchema];
    const fieldComponentName = fieldSchema?.['x-component']?.toLowerCase() || '';
    if (!['subtable', 'associatedrecords'].includes(fieldComponentName)) {
      return [key, value];
    }
    const isEmptyValue = (value: unknown): boolean => {
      return isEmptyArray(value) || isEmptyObject(value) || isUndefined(value) || value === '';
    };
    const isInvalidAssociatedRecord = (value: unknown): boolean => {
      return isEmptyObject(value) && !isArray(value);
    };
    const isInvalidSubtable = (value: unknown): boolean => {
      if (isEmptyValue(value)) {
        return true;
      }
      if (isObject(value) && !isArray(value)) {
        return values(value).every(isInvalidSubtable);
      }
      return isEmptyArray(value) || (isArray(value) && !!value?.every(isInvalidSubtable));
    };
    const isInvalidValue = isInvalidAssociatedRecord(value) || isInvalidSubtable(value);
    return isInvalidValue ? false : [key, value];
  });
  const transform = pipe(entries, valueMapper, filter(Boolean), fromPairs);
  return transform(data);
}

interface GetRequestDataByDiffFormData {
  defaultValue?: Record<string, any>;
  currentValue: Record<string, any>;
  appID: string;
  pageID: string;
  schemaMap: Record<string, SchemaFieldItem>;
}
export function getRequestDiffFormData({
  defaultValue, currentValue, appID, pageID, schemaMap,
}: GetRequestDataByDiffFormData): FormDataRequestParams | undefined | string {
  const formData = removeEmptySubTableOrAssociatedRecords(currentValue, schemaMap);
  const diffResult = difference(defaultValue || {}, formData);
  if (isEmpty(diffResult)) {
    return '数据未更改, 此次未保存';
  }

  const subTableChangedKeys = Object.keys(diffResult).filter(isSubTable(schemaMap));
  const hasSubTableChanged = !!(subTableChangedKeys.length && defaultValue);

  const ref: FormDataRequestUpdateParamsRef = {};
  if (hasSubTableChanged) {
    subTableChangedKeys.forEach((fieldKey) => {
      Object.assign(ref, {
        [fieldKey]: {
          appID: appID,
          tableID: pageID,
          updated: parseUpdated(diffResult, fieldKey),
          new: parseNew(formData, fieldKey),
          deleted: parseDeleted(formData, fieldKey, defaultValue),
        },
      });
    });
  }

  const initialMethod = defaultValue ? 'update' : 'create';
  const reqData: FormDataRequestCreateParams | FormDataRequestUpdateParams = buildRequestParams(
    initialMethod === 'create' ? formData : omitBy(formData, (_, key) => {
      return schemaMap[key]?.componentName === 'subtable' || !(key in schemaMap);
    }),
    defaultValue?._id,
    initialMethod,
    ref,
  );

  return reqData;
}
