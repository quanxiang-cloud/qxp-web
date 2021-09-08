import { pipe, entries, map, reduce, cond } from 'lodash/fp';

import { INTERNAL_FIELD_NAMES } from '@home/pages/app-details/constants';
import schemaToFields from '@lib/schema-convert';
import { PERMISSION } from '@c/form-builder/constants';
import {
  FieldPermission, NewFieldPermission, CustomFieldPermission, SystemFieldPermission, NewFieldPermissionValue,
} from '@flow/content/editor/type';

import { EDIT_VALUE } from './constants';

type FieldPermissionMergeType = CustomFieldPermission & SystemFieldPermission & {
  isSystem: boolean;
  path: string;
  hidden: boolean;
};

export function fieldPermissionEncoder(value: FieldPermission): NewFieldPermission {
  const { custom, system } = value;
  const customEncoded = custom.reduce((acc, cur) => {
    const leftValue = cur.read ? 0b01 : 0b00;
    const rightValue = cur.write ? 0b10 : 0b00;
    return {
      ...acc,
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': {
          permission: leftValue + rightValue,
        },
        initialValue: cur.initialValue,
        submitValue: cur.submitValue,
      },
    };
  }, {});
  const systemEncoded = system.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': {
          permission: cur.read ? PERMISSION.READONLY : PERMISSION.INVISIBLE,
        },
      },
    };
  }, {});
  return { ...customEncoded, ...systemEncoded };
}

export function fieldPermissionDecoder(
  value: FieldPermission | NewFieldPermission, schema: ISchema,
): FieldPermission | void {
  if (value.custom || value.system) {
    return value as FieldPermission;
  }
  const schemaIDToSchemaMap = schemaToFields(
    schema, undefined, { parseSubTable: true, keepLayout: true },
  ).map((schema) => ({ [schema.id]: schema })).reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const convertor: (value: NewFieldPermission) => FieldPermission | void = pipe(
    entries,
    map(([fieldID, fieldValue]: [string, NewFieldPermissionValue]): FieldPermissionMergeType => {
      const permission = fieldValue?.['x-internal'].permission;
      return {
        isSystem: INTERNAL_FIELD_NAMES.includes(fieldID),
        fieldName: fieldValue.fieldName,
        id: fieldID,
        read: permission === PERMISSION.READONLY || permission === PERMISSION.NORMAL,
        write: permission === PERMISSION.EDITABLE || permission === PERMISSION.NORMAL,
        initialValue: fieldValue.initialValue || EDIT_VALUE,
        submitValue: fieldValue.submitValue || EDIT_VALUE,
        path: schemaIDToSchemaMap[fieldID].originPathInSchema,
        hidden: !!schemaIDToSchemaMap[fieldID]['x-internal']?.isLayoutComponent,
      };
    }),
    reduce((acc: FieldPermission, cur: FieldPermissionMergeType): FieldPermission => {
      const condition = cond<FieldPermissionMergeType, FieldPermission>([
        [({ isSystem }) => isSystem, () => {
          acc.system.push({
            fieldName: cur.fieldName,
            read: cur.read,
            id: cur.id,
          });
          return acc;
        }],
        [({ isSystem }) => !isSystem, () => {
          acc.custom.push({
            fieldName: cur.fieldName,
            read: cur.read,
            write: cur.write,
            initialValue: cur.initialValue,
            submitValue: cur.submitValue,
            id: cur.id,
            path: cur.path,
            hidden: cur.hidden,
          });
          return acc;
        }],
      ]);
      return condition(cur);
    }, { system: [], custom: [] }),
  );

  return convertor(value as NewFieldPermission);
}
