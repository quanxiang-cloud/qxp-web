import { omit, isEmpty, isEqual } from 'lodash';

import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import {
  FormDataRequestUpdateParamsRef,
  FormDataBody,
  SubTableUpdateData,
} from '@lib/http-client';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';

type Values = Record<string, any>;

function parseDeleted(
  oldValue: Values[], newValue: Values[],
): string[] {
  return oldValue.reduce<string[]>((acc, value) => {
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
    if (!schemaMap[fieldKey]) {
      if (!isEqual(oldValue, cValue)) {
        resultValue[fieldKey] = cValue;
      }

      return;
    }

    switch (schemaMap[fieldKey]['x-component']) {
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
        const _oldValue = (oldValue as Record<string, any>[]).find(({ _id }) => _id === _value._id);
        if (_oldValue) {
          const _newValue = formDataDiff(
            _value,
            _oldValue,
              schemaMap[fieldKey].items as ISchema,
          );
          return isEmpty(_newValue) ? acc : [...acc, { ..._newValue, _id: _value._id }];
        }

        newValues.push(_value);
        return acc;
      }, []);

      if (newValues.length || deleted.length || updatedValues.length) {
        resultValue[fieldKey] = [newValues, deleted, updatedValues];
      }
      break;
    }
    case 'CheckboxGroup':
    case 'MultipleSelect':
    case 'AssociatedRecords': {
      if (oldValue.sort().toString() !== cValue.sort().toString()) {
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

function buildSubTableParams(type: string, valueList = []): SubTableUpdateData {
  switch (type) {
  case 'create':
    return {
      new: valueList.map((value: Record<string, any>) => {
        return {
          entity: value,
        };
      }),
    };
  case 'updated': {
    const [newValues = [], deleted = [], updatedValues = []] = valueList;
    return {
      new: (newValues as Record<string, any>[]).map((value) => {
        return {
          entity: value,
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

export function buildFormDataReqParams(
  schema: ISchema,
  type: string,
  values?: Record<string, any>,
): FormDataBody {
  const subTableFields = schemaToFields(schema, (schemaField) => {
    return schemaField['x-component'] === 'SubTable';
  });

  const ref: FormDataRequestUpdateParamsRef = {};
  if (subTableFields.length) {
    subTableFields.forEach((field) => {
      const { subordination, appID, tableID } = field?.['x-component-props'] || {};

      ref[field.id] = {
        type: subordination || 'sub_table',
        appID,
        tableID,
        ...buildSubTableParams(type, values?.[field.id]),
      };
    });
  }

  const formDataResBody: FormDataBody = { };

  if (!isEmpty(ref)) {
    formDataResBody.ref = ref;
  }

  if (values) {
    formDataResBody.entity = omit(values, subTableFields.map(({ id }) => id));
  }

  return formDataResBody;
}
