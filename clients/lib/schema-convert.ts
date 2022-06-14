import { groupBy, merge } from 'lodash';

import { FormFieldOption } from '@flow/content/editor/forms/api';
import { PERMISSION } from '@c/form-builder/constants';
import treeUtil from '@lib/tree';
import {
  numberTransform, isPermissionReadable, isPermissionHiddenAble, isPermissionWriteable, isPermissionEditable,
} from '@c/form-builder/utils';

function quickSortObjectArray<T extends Record<string, T[keyof T]>>(key: string, arr: T[]): T[] {
  if (!arr?.length || !key) return [];
  const [head, ...tail] = arr;
  const left = tail.filter((e) => (e[key] ?? 0) < (head[key] ?? 0));
  const right = tail.filter((e) => (e[key] ?? 0) >= (head[key] ?? 0));
  return quickSortObjectArray<T>(key, left).concat(head, quickSortObjectArray(key, right));
}

export type FilterFunc = (currentSchema: ISchema) => boolean;
export type FieldsFilterFunc = (currentSchema: SchemaFieldItem) => boolean;
export type SchemaToOptionsOptions = SchemaToArrayOptions;
export interface SchemaToArrayOptions {
  keepLayout?: boolean;
  parseSubTable?: boolean;
  filter?: FilterFunc;
}

function isSchemaValid(schema: ISchema): boolean {
  return !!schema?.['x-component'];
}

function schemaItemToSchemaFieldItem(schema: ISchema): SchemaFieldItem {
  const internal = schema?.['x-internal'];
  const fieldId = internal?.fieldId;

  return {
    ...schema,
    id: fieldId || '',
    fieldName: fieldId || '',
    componentName: schema['x-component']?.toLowerCase() || '',
    tabIndex: internal?.tabIndex,
    'x-index': numberTransform(schema),
  };
}

function sortSchemaArray<T extends ISchema>(fields: T[]): T[] {
  const {
    true: systemFields, false: normalFields,
  } = groupBy(fields, (field) => !!field['x-internal']?.isSystem);
  const sorter = (arr: T[]): T[] => quickSortObjectArray<any>('x-index', arr);
  return [...sorter(normalFields), ...sorter(systemFields)];
}

export function schemaToArray(schema?: ISchema, options?: SchemaToArrayOptions): ISchema[] {
  const childPropertiesToParse = ['properties'];
  options?.parseSubTable && childPropertiesToParse.push('items');
  let schemas = treeUtil.toArray<ISchema>(
    childPropertiesToParse, schema as ISchema,
  ).filter((schema) => {
    if (!options?.keepLayout) {
      return isSchemaValid(schema) && !schema?.['x-internal']?.isLayoutComponent;
    }
    return isSchemaValid(schema);
  }).map(({
    fieldIndex, fieldPath, ...schema
  }: ISchema & { fieldPath?: string; fieldIndex?: string | number }) => {
    return merge(schema, { 'x-internal': { fieldId: fieldIndex, fieldPath } });
  });
  schemas = options?.filter ? schemas.filter((schema) => options?.filter?.(schema)) : schemas;
  return sortSchemaArray(schemas);
}

export function schemaToOptions(schema?: ISchema, options?: SchemaToOptionsOptions): FormFieldOption[] {
  return schemaToArray(schema, options).map((field: ISchema) => {
    const permission = field?.['x-internal']?.permission as PERMISSION;
    return {
      label: field.title as string,
      value: field['x-internal']?.fieldId || '',
      isSystem: !!field['x-internal']?.isSystem,
      isLayout: !!field['x-internal']?.isLayoutComponent,
      path: field['x-internal']?.fieldPath || '',
      read: isPermissionReadable(permission),
      write: isPermissionWriteable(permission),
      invisible: isPermissionHiddenAble(permission),
      editable: isPermissionEditable(permission),
    };
  });
}

export function schemaToFields(
  schema?: ISchema, filter?: FieldsFilterFunc | null, options?: SchemaToArrayOptions,
): Array<SchemaFieldItem> {
  let fields = schemaToArray(schema, options).map((schema) => schemaItemToSchemaFieldItem(schema));
  fields = filter ? fields.filter(filter) : fields;
  return sortSchemaArray(fields);
}

export function schemaToMap(
  schema?: ISchema, filter?: FieldsFilterFunc | null, options?: SchemaToArrayOptions,
): Record<string, SchemaFieldItem> {
  return schemaToFields(schema, filter, options).reduce(
    (fieldsMap: Record<string, SchemaFieldItem>, field: SchemaFieldItem) => {
      const fieldId = field?.['x-internal']?.fieldId;
      if (fieldId) fieldsMap[fieldId] = field;
      return fieldsMap;
    }, {},
  );
}

export default schemaToFields;
