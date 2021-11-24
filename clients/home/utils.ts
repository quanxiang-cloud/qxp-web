import { omit, isEmpty } from 'lodash';

import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import {
  FormDataRequestUpdateParamsRef,
  FormDataBody,
  RefData,
} from '@lib/http-client';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';

type Values = Record<string, any>;

function parseDeleted(
  oldValue: Values[], newValue: Values[],
): string[] {
  return (oldValue || []).reduce<string[]>((acc, value) => {
    if (value?._id && !newValue.find(({ _id: id }) => id === value._id)) {
      return [...acc, value._id];
    }

    return acc;
  }, []);
}

export function formDataDiff(
  currentValues: Values,
  defaultValues: Values,
  schema: ISchema,
): Record<string, any> {
  const schemaMap = schemaToMap(schema);
  const resultValue: any = {};
  Object.entries(currentValues).forEach(([fieldKey, cValue]) => {
    if (SYSTEM_FIELDS.includes(fieldKey)) {
      return;
    }

    const oldValue = defaultValues[fieldKey];
    switch (schemaMap[fieldKey]?.['x-component']) {
    case 'OrganizationPicker':
    case 'UserPicker':
    case 'ImageUpload':
    case 'FileUpload': {
      const newValueStr = cValue ? (cValue as LabelValue[]).map(({ value }) => value).sort().join('') : '';
      const oldValueStr = oldValue ? (oldValue as LabelValue[]).map(({ value }) => {
        return value;
      }).sort().join('') : '';

      if (newValueStr !== oldValueStr) {
        resultValue[fieldKey] = cValue;
      }
      break;
    }
    case 'SubTable': {
      const deleted = parseDeleted(oldValue, cValue);
      const newValues: Values[] = [];
      const updatedValues = (cValue as Record<string, any>[]).reduce<Record<string, any>[]>((acc, _value) => {
        const _oldValue = ((oldValue || []) as Record<string, any>[]).find(({ _id }) => _id === _value._id);
        if (_oldValue) {
          const _newValue = formDataDiff(
            _value,
            _oldValue,
              (schemaMap[fieldKey].items || window[`schema-${fieldKey}`]) as ISchema,
          );

          return isEmpty(_newValue) ? acc : [...acc, { ..._newValue, _id: _value._id }];
        }

        !isEmpty(_value) && newValues.push(_value);
        return acc;
      }, []);

      if (newValues.length || deleted.length || updatedValues.length) {
        resultValue[fieldKey] = [newValues, deleted, updatedValues];
      }
      break;
    }
    case 'AssociatedRecords': {
      const oldValueIDs = (oldValue || []).map(({ _id }: Record<string, any>) => _id);
      const cValueIDs = (cValue || []).map(({ _id }: Record<string, any>) => _id);
      const deleted: string[] = oldValueIDs.filter((value: string) => !cValueIDs.includes(value));
      const newValues = cValueIDs.filter((id: string) => {
        return !(oldValueIDs || []).includes(id);
      });
      if (newValues.length || deleted.length) {
        resultValue[fieldKey] = [newValues, deleted];
      }
      break;
    }
    case 'CheckboxGroup':
    case 'MultipleSelect': {
      if (oldValue?.sort().toString() !== cValue.sort().toString()) {
        resultValue[fieldKey] = cValue;
      }
      break;
    }
    case 'CascadeSelector':
    case 'AssociatedData': {
      if (cValue?.value !== oldValue?.value) {
        resultValue[fieldKey] = cValue;
      }
      break;
    }
    default:
      if (cValue !== oldValue) {
        resultValue[fieldKey] = cValue;
      }
      break;
    }
  });

  return resultValue;
}

function buildRecordsParams(
  type: string,
  valueList = [],
): RefData {
  if (type === 'create') {
    return {
      new: valueList,
    };
  }

  const [newValues = [], deleted = []] = valueList;
  return {
    new: newValues,
    deleted: deleted,
  };
}

function buildSubTableParams(
  type: string,
  valueList = [],
  ref?: FormDataRequestUpdateParamsRef,
): RefData {
  switch (type) {
  case 'create':
    return {
      new: valueList.map((value: Record<string, any>) => {
        return {
          entity: value,
          ref,
        };
      }),
    };
  case 'updated': {
    const [newValues = [], deleted = [], updatedValues = []] = valueList;
    return {
      new: (newValues as Record<string, any>[]).map((value) => {
        return {
          entity: value,
          ref,
        };
      }),
      deleted: deleted,
      updated: (updatedValues as Record<string, any>[]).map((value) => {
        return {
          entity: omit(value, SYSTEM_FIELDS),
          query: {
            term: { _id: value._id },
          },
        };
      }),
    };
  }
  default:
    return {};
  }
}

function buildRef(
  schema: ISchema,
  type: string,
  values?: Record<string, any>,
): [FormDataRequestUpdateParamsRef, string[]] {
  const ref: FormDataRequestUpdateParamsRef = {};
  const refFields = schemaToFields(schema, (schemaField) => {
    return ['SubTable', 'Serial', 'AssociatedRecords'].includes(schemaField['x-component'] || '');
  });

  if (refFields.length) {
    refFields.forEach(async (field) => {
      switch (field['x-component']) {
      case 'SubTable': {
        const { subordination, appID, tableID } = field?.['x-component-props'] || {};
        const [subRef] = buildRef(subordination === 'foreign_table' ?
          window[`schema-${field.id}`] : field.items as ISchema, 'create');
        const _ref = subRef;

        if (values?.[field.id]?.length) {
          ref[field.id] = {
            type: subordination || 'sub_table',
            appID,
            tableID,
            ...buildSubTableParams(type, values[field.id], _ref),
          };
        }
      }
        break;
      case 'Serial': {
        if (type === 'create') {
          ref[field.id] = {
            type: 'serial',
          };
        }
      }
        break;
      case 'AssociatedRecords': {
        const { appID, tableID } = field?.['x-component-props'] || {};
        if (values?.[field.id]?.length) {
          ref[field.id] = {
            type: 'associated_records',
            appID,
            tableID,
            ...buildRecordsParams(
              type,
              (values[field.id] || []).map((value: Record<string, any> | string[]) => {
                // 判断是否是Diff过的数据
                if (Array.isArray(value)) {
                  return value;
                }

                return value._id;
              })),
          };
        }
      }
        break;
      }
    });
  }

  return [ref, refFields.map(({ id }) => id)];
}

export function buildFormDataReqParams(
  schema: ISchema,
  type: string,
  values?: Record<string, any>,
): FormDataBody {
  const [ref, omitFields] = buildRef(schema, type, values);

  const formDataResBody: FormDataBody = {};

  if (!isEmpty(ref)) {
    formDataResBody.ref = ref;
  }

  if (values) {
    formDataResBody.entity = omit(values, omitFields);
  }

  return formDataResBody;
}
