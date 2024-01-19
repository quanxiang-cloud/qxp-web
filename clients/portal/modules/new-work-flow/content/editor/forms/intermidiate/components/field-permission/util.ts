/* eslint-disable guard-for-in */
/* eslint-disable max-len */
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
} from '@newFlow/content/editor/type';

import { EDIT_VALUE } from './constants';

type FieldPermissionMergeType = CustomFieldPermission & SystemFieldPermission & {
  isSystem: boolean;
  path: string;
  hidden: boolean;
};

export function fieldPermissionEncoder(value: FieldPermission): NewFieldPermission {
  const { custom, system } = value;
  const customEncoded = custom?.reduce((acc, cur) => {
    const permission = calculateFieldPermission(cur.editable, cur.invisible, cur.write, cur.read, true);
    const { subTableAdd = true, subTableDelete = true } = (cur || {}) as any;
    Object.assign(acc, {
      [cur.id]: {
        fieldName: cur.fieldName,
        'x-internal': { permission },
        initialValue: cur.initialValue,
        submitValue: cur.submitValue,
        'x-component-props': {
          subTableAdd,
          subTableDelete,
        },
      },
    });
    return acc;
  }, {});
  const systemEncoded = system?.reduce((acc, cur) => {
    const permission = calculateFieldPermission(false, false, false, cur.read);
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
    }))?.reduce((acc, cur) => ({ ...acc, ...cur }), {});
}

function fieldPermissionReducer(acc: FieldPermission | any, cur: FieldPermissionMergeType | any): FieldPermission {
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
    readonly: !cur.editable && !cur.invisible,
    initialValue: cur.initialValue,
    submitValue: cur.submitValue,
    id: cur.id,
    path: cur.path,
    hidden: cur.hidden,
    subTableAdd: cur?.subTableAdd,
    subTableDelete: cur?.subTableDelete,
  });
  return acc;
}

function getPermission(permission?: PERMISSION, isLayoutComponent?: boolean): PERMISSION_TYPE {
  if (!permission) {
    return {
      read: !!isLayoutComponent,
      write: false,
      invisible: false,
      editable: false,
      readonly: !!isLayoutComponent,
    };
  }

  const readable = isPermissionReadable(permission);
  const invisible = readable ? isPermissionHiddenAble(permission) : false;
  const editable = readable ? isPermissionEditable(permission) : false;

  return {
    read: readable,
    write: readable ? isPermissionWriteable(permission) : false,
    invisible,
    editable,
    readonly: readable && !invisible && !editable,
  };
}

export function fieldPermissionDecoder(
  value: FieldPermission | NewFieldPermission, schema: ISchema, subPermission?: any,
): FieldPermission | void {
  if (value?.custom || value?.system) {
    return value as FieldPermission;
  }
  const schemaIDToSchemaMap = getSchemaIDToSchemaMap(schema);
  const convertor: (value: NewFieldPermission) => FieldPermissionMergeType[] | void = pipe(
    entries,
    map(([fieldID, fieldValue]: [string, NewFieldPermissionValue | any]): FieldPermissionMergeType | null => {
      const permission = fieldValue?.['x-internal']?.permission;
      const subPer = subPermission?.[fieldID];
      let { subTableAdd = true, subTableDelete = true } = subPer || fieldValue?.['x-component-props'] || {};
      const { editable } = getPermission(permission as PERMISSION);
      if (!editable) {
        subTableAdd = undefined;
        subTableDelete = undefined;
      }

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
        subTableAdd,
        subTableDelete,
      } as any;
    }),
    filter(Boolean),
  );
  const fields = convertor(value as NewFieldPermission) || [];
  return fields?.reduce(fieldPermissionReducer, { system: [], custom: [] });
}

export function getInitFieldPermissionFromSchema(schema: ISchema): NewFieldPermission {
  const fields = schemaToArray(schema, { parseSubTable: true, keepLayout: true })
    .map((schema): FieldPermissionMergeType => {
      const fieldId = schema['x-internal']?.fieldId;
      const isLayoutComponent = !!schema['x-internal']?.isLayoutComponent;
      const permission = schema['x-internal']?.permission;
      return {
        ...getPermission(permission, isLayoutComponent),
        isSystem: INTERNAL_FIELD_NAMES.includes(fieldId || ''),
        fieldName: schema.title as string,
        id: fieldId || '',
        initialValue: EDIT_VALUE,
        submitValue: EDIT_VALUE,
        path: schema['x-internal']?.fieldPath || '',
        hidden: isLayoutComponent,
      };
    });

  return fieldPermissionEncoder(fields?.reduce(fieldPermissionReducer, { system: [], custom: [] }));
}

export const getSubFieldPermission = (val: any)=>{
  const _subFieldPermission: any = {};
  for (const key in val) {
    const cprop: any = val[key]?.['x-component-props'];
    const isEdit = val[key]?.['x-internal']?.permission === 11;
    if (cprop) {
      if (isEdit) {
        _subFieldPermission[key] = {
          subTableAdd: cprop?.subTableAdd,
          subTableDelete: cprop?.subTableDelete,
        };
      } else {
        _subFieldPermission[key] = {
          subTableAdd: true,
          subTableDelete: true,
        };
      }
    }
  }
  return _subFieldPermission;
};
