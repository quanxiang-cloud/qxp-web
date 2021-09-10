import { pipe, entries, map, get } from 'lodash/fp';

import { INTERNAL_FIELD_NAMES } from '@home/pages/app-details/constants';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { isPermissionReadable, isPermissionWritable, isPermissionHiddenAble } from '@c/form-builder/utils';
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
    const writeValue = cur.write ? 0b010 : 0b000;
    const hiddenValue = cur.invisible ? 0b100 : 0b000;
    const readValue = cur.read ? 0b001 : 0b000;
    return {
      ...acc,
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': {
          permission: hiddenValue + writeValue + readValue,
        },
        initialValue: cur.initialValue,
        submitValue: cur.submitValue,
      },
    };
  }, {});
  const systemEncoded = system.reduce((acc, cur) => {
    const hiddenValue = cur.invisible ? 0b100 : 0b000;
    const readValue = cur.read ? 0b001 : 0b000;
    return {
      ...acc,
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': {
          permission: hiddenValue + readValue,
        },
      },
    };
  }, {});
  return { ...customEncoded, ...systemEncoded };
}

function getSchemaIDToSchemaMap(schema: ISchema): Record<string, SchemaFieldItem> {
  return schemaToFields(
    schema, undefined, { parseSubTable: true, keepLayout: true },
  ).map((schema) => ({ [schema.id]: schema })).reduce((acc, cur) => ({ ...acc, ...cur }), {});
}

function fieldPermissionReducer(acc: FieldPermission, cur: FieldPermissionMergeType): FieldPermission {
  cur.isSystem && acc.system.push({
    fieldName: cur.fieldName,
    read: cur.read,
    id: cur.id,
    invisible: cur.invisible,
  });
  !cur.isSystem && acc.custom.push({
    fieldName: cur.fieldName,
    read: cur.read,
    write: cur.write,
    invisible: cur.invisible,
    initialValue: cur.initialValue,
    submitValue: cur.submitValue,
    id: cur.id,
    path: cur.path,
    hidden: cur.hidden,
  });
  return acc;
}

export function fieldPermissionDecoder(
  value: FieldPermission | NewFieldPermission, schema: ISchema,
): FieldPermission | void {
  if (value.custom || value.system) {
    return value as FieldPermission;
  }
  const schemaIDToSchemaMap = getSchemaIDToSchemaMap(schema);

  const convertor: (value: NewFieldPermission) => FieldPermissionMergeType[] | void = pipe(
    entries,
    map(([fieldID, fieldValue]: [string, NewFieldPermissionValue]): FieldPermissionMergeType => {
      const permission = fieldValue?.['x-internal'].permission;
      return {
        isSystem: INTERNAL_FIELD_NAMES.includes(fieldID),
        fieldName: fieldValue.fieldName,
        id: fieldID,
        read: isPermissionReadable(permission),
        write: isPermissionWritable(permission),
        invisible: isPermissionHiddenAble(permission),
        initialValue: fieldValue.initialValue || EDIT_VALUE,
        submitValue: fieldValue.submitValue || EDIT_VALUE,
        path: schemaIDToSchemaMap[fieldID]?.originPathInSchema,
        hidden: !!schemaIDToSchemaMap[fieldID]?.['x-internal']?.isLayoutComponent,
      };
    }),
  );

  const fields = convertor(value as NewFieldPermission) || [];
  return fields.reduce(fieldPermissionReducer, { system: [], custom: [] });
}

export function getInitFieldPermissionFromSchema(schema: ISchema): NewFieldPermission {
  const schemaIDToSchemaMap = getSchemaIDToSchemaMap(schema);

  const convertor = pipe(
    get('properties'),
    entries,
    map(([fieldID, fieldSchema]): FieldPermissionMergeType => {
      const permission = fieldSchema?.['x-internal'].permission;
      return {
        isSystem: INTERNAL_FIELD_NAMES.includes(fieldID),
        fieldName: fieldSchema.title,
        id: fieldID,
        read: isPermissionReadable(permission),
        write: isPermissionWritable(permission),
        invisible: isPermissionHiddenAble(permission),
        initialValue: EDIT_VALUE,
        submitValue: EDIT_VALUE,
        path: schemaIDToSchemaMap[fieldID].originPathInSchema,
        hidden: !!schemaIDToSchemaMap[fieldID]['x-internal']?.isLayoutComponent,
      };
    }),
  );

  const fields = convertor(schemaToMap(schema, undefined, { parseSubTable: true, keepLayout: true }));

  return fieldPermissionEncoder(fields.reduce(fieldPermissionReducer, { system: [], custom: [] }));
}
