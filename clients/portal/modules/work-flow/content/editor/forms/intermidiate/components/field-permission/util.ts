import { pipe, entries, map, filter } from 'lodash/fp';

import { INTERNAL_FIELD_NAMES } from '@home/pages/app-details/constants';
import { schemaToArray } from '@lib/schema-convert';
import { PERMISSION, PERMISSION_TYPE } from '@c/form-builder/constants';
import {
  isPermissionReadable,
  isPermissionWriteable,
  isPermissionHiddenAble,
  calculateFieldPermission,
  isPermissionEditable,
} from '@c/form-builder/utils';
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
    const permission = calculateFieldPermission(cur.editable, cur.invisible, cur.write, cur.read, true);
    Object.assign(acc, {
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': { permission },
        initialValue: cur.initialValue,
        submitValue: cur.submitValue,
      },
    });
    return acc;
  }, {});
  const systemEncoded = system.reduce((acc, cur) => {
    const permission = calculateFieldPermission(false, true, false, cur.read);
    Object.assign(acc, {
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': { permission },
      },
    });
    return acc;
  }, {});
  return { ...customEncoded, ...systemEncoded };
}

function getSchemaIDToSchemaMap(schema: ISchema): Record<string, ISchema> {
  return schemaToArray(schema, { parseSubTable: true, keepLayout: true })
    .map((schema) => ({
      [schema['x-internal']?.fieldId || '']: schema,
    })).reduce((acc, cur) => ({ ...acc, ...cur }), {});
}

function fieldPermissionReducer(acc: FieldPermission, cur: FieldPermissionMergeType): FieldPermission {
  cur.isSystem && acc.system.push({
    fieldName: cur.fieldName,
    read: cur.read,
    id: cur.id,
  });
  !cur.isSystem && acc.custom.push({
    fieldName: cur.fieldName,
    read: cur.read,
    write: cur.write,
    invisible: cur.invisible,
    editable: cur.editable,
    initialValue: cur.initialValue,
    submitValue: cur.submitValue,
    id: cur.id,
    path: cur.path,
    hidden: cur.hidden,
  });
  return acc;
}

function getPermission(permission?: PERMISSION): PERMISSION_TYPE {
  if (!permission) {
    return {
      read: false, write: false, invisible: false, editable: false,
    };
  }

  const readable = isPermissionReadable(permission);
  return {
    read: readable,
    write: readable ? isPermissionWriteable(permission) : false,
    invisible: readable ? isPermissionHiddenAble(permission) : false,
    editable: readable ? isPermissionEditable(permission) : false,
  };
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
    map(([fieldID, fieldValue]: [string, NewFieldPermissionValue]): FieldPermissionMergeType | null => {
      const permission = fieldValue?.['x-internal'].permission;
      const targetSchema = schemaIDToSchemaMap[fieldID];
      if (!targetSchema) {
        return null;
      }
      return {
        ...getPermission(permission as PERMISSION),
        isSystem: INTERNAL_FIELD_NAMES.includes(fieldID),
        fieldName: fieldValue.fieldName,
        id: fieldID,
        initialValue: fieldValue.initialValue || EDIT_VALUE,
        submitValue: fieldValue.submitValue || EDIT_VALUE,
        path: targetSchema?.['x-internal']?.fieldPath || '',
        hidden: !!targetSchema?.['x-internal']?.isLayoutComponent,
      };
    }),
    filter(Boolean),
  );
  const fields = convertor(value as NewFieldPermission) || [];

  return fields.reduce(fieldPermissionReducer, { custom: [], system: [] });
}

export function getInitFieldPermissionFromSchema(schema: ISchema): NewFieldPermission {
  const fields = schemaToArray(schema, { parseSubTable: true, keepLayout: true })
    .map((schema): FieldPermissionMergeType => {
      const fieldId = schema['x-internal']?.fieldId;
      return {
        ...getPermission(),
        isSystem: INTERNAL_FIELD_NAMES.includes(fieldId || ''),
        fieldName: schema.title as string,
        id: fieldId || '',
        initialValue: EDIT_VALUE,
        submitValue: EDIT_VALUE,
        path: schema['x-internal']?.fieldPath || '',
        hidden: !!schema['x-internal']?.isLayoutComponent,
      };
    });

  return fieldPermissionEncoder(fields.reduce(fieldPermissionReducer, { system: [], custom: [] }));
}
