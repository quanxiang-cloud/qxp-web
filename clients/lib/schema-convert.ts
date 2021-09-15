import { groupBy, isUndefined } from 'lodash';

import { FormFieldOption } from '@flow/content/editor/forms/api';
import { quickSortObjectArray } from '@lib/utils';
import { PERMISSION } from '@c/form-builder/constants';
import treeUtil from '@lib/tree';
import {
  numberTransform, isPermissionReadable, isPermissionHiddenAble, isPermissionWriteable, isPermissionEditable,
} from '@c/form-builder/utils';

export type FilterFunc = (currentSchema: SchemaWithPathAndIndex) => boolean;
export type FieldsFilterFunc = (currentSchema: SchemaFieldItem) => boolean;
export type SchemaToOptionsOptions = SchemaToArrayOptions;
export type SchemaToMapOptions = SchemaToArrayOptions;
export type SchemaWithPathAndIndex = ISchema & {
  fieldPath: string;
  fieldIndex: string,
  properties?: {
    [key: string]: SchemaWithPathAndIndex;
  };
};
export interface SchemaToArrayOptions {
  keepLayout?: boolean;
  parseSubTable?: boolean;
  filter?: FilterFunc;
}

function isSchemaValid(schema: ISchema): boolean {
  return !!schema?.['x-component'];
}

function schemaItemToSchemaFieldItem(schema: SchemaWithPathAndIndex): SchemaFieldItem {
  return {
    ...schema,
    id: schema.fieldIndex,
    fieldName: schema.fieldIndex,
    componentName: schema['x-component']?.toLowerCase() || '',
    fieldPath: schema.fieldIndex,
    parentField: schema?.['x-internal']?.parentField,
    tabIndex: schema?.['x-internal']?.tabIndex,
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

export function schemaToArray(schema?: ISchema, options?: SchemaToArrayOptions): SchemaWithPathAndIndex[] {
  const childPropertiesToParse = ['properties'];
  options?.parseSubTable && childPropertiesToParse.push('items');
  let schemas = treeUtil.toArray<SchemaWithPathAndIndex>(
    childPropertiesToParse, schema as SchemaWithPathAndIndex,
  ).filter((schema: ISchema) => {
    if (!options?.keepLayout) {
      return isSchemaValid(schema) && !schema?.['x-internal']?.isLayoutComponent;
    }
    return isSchemaValid(schema);
  });
  schemas = options?.filter ? schemas.filter((schema) => options?.filter?.(schema)) : schemas;
  return sortSchemaArray(schemas);
}

export function schemaToOptions(schema?: ISchema, options?: SchemaToOptionsOptions): FormFieldOption [] {
  return schemaToArray(schema, options).map((field: SchemaWithPathAndIndex) => {
    const permission = field?.['x-internal']?.permission as PERMISSION;
    return {
      label: field.title as string,
      value: field.fieldIndex,
      isSystem: !!field['x-internal']?.isSystem,
      isLayout: !!field['x-internal']?.isLayoutComponent,
      path: field.fieldPath,
      read: isPermissionReadable(permission),
      write: isPermissionWriteable(permission),
      invisible: isPermissionHiddenAble(permission),
      editable: isPermissionEditable(permission),
    };
  });
}

export function schemaToFields(schema?: ISchema, filter?: FieldsFilterFunc): Array<SchemaFieldItem> {
  let fields = schemaToArray(schema).map((schema) => schemaItemToSchemaFieldItem(schema));
  fields = filter ? fields.filter((field) => filter(field)) : fields;
  return sortSchemaArray(fields);
}

export function schemaToMap(schema?: ISchema, filter?: FieldsFilterFunc): Record<string, SchemaFieldItem> {
  return schemaToFields(schema, filter).reduce(
    (fieldsMap: Record<string, SchemaFieldItem>, field: SchemaFieldItem) => {
      fieldsMap[field.fieldName] = field;
      return fieldsMap;
    }, {},
  );
}

export function fieldsToSchema(fields: Array<SchemaFieldItem>): ISchema {
  const properties: Record<string, ISchema> = {};

  const { false: fieldsNoParent, true: fieldsWithParent } = groupBy(fields, (field) => !!field.parentField);

  fieldsNoParent?.forEach((field) => {
    const fileName = field.fieldName;
    properties[fileName] = {
      ...field,
      properties: {},
    };
  });

  fieldsWithParent?.forEach((field) => {
    const fileName = field.fieldName;
    const parentProperties = properties[field.parentField || '']?.properties;
    if (isUndefined(parentProperties)) return;
    parentProperties[fileName] = field;
  });

  return {
    type: 'object',
    title: '',
    properties,
  };
}

export default schemaToFields;
