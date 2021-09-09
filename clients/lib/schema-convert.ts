import { isEmpty, cloneDeep, groupBy, isUndefined } from 'lodash';
import fp from 'lodash/fp';

import { FormFieldOption } from '@flow/content/editor/forms/api';
import { quickSortObjectArray } from '@lib/utils';
import {
  numberTransform, isPermissionReadable, isPermissionHiddenAble, isPermissionWritable,
} from '@c/form-builder/utils';

export type SchemaConvertOptions = { keepLayout?: boolean; parseSubTable?: boolean; };
export type FilterFunc = (currentSchema: ISchema) => boolean;

export function schemaToOptions(
  schema?: ISchema, filterFunc?: FilterFunc, options?: SchemaConvertOptions,
): FormFieldOption [] {
  return schemaToFields(schema, filterFunc, options).map((field: SchemaFieldItem) => ({
    label: field.title as string,
    value: field.id,
    isSystem: !!field['x-internal']?.isSystem,
    isLayout: !!field['x-internal']?.isLayoutComponent,
    path: field.originPathInSchema,
    read: isPermissionReadable(field?.['x-internal']?.permission),
    write: isPermissionWritable(field?.['x-internal']?.permission),
    invisible: isPermissionHiddenAble(field?.['x-internal']?.permission),
  }));
}

export function schemaToMap(
  schema?: ISchema, filterFunc?: FilterFunc, options?: SchemaConvertOptions,
): Record<string, SchemaFieldItem> {
  const fields = schemaToFields(schema, filterFunc, options);
  return fields.reduce((fieldsMap: Record<string, SchemaFieldItem>, field: SchemaFieldItem) => {
    fieldsMap[field.fieldName] = field;
    return fieldsMap;
  }, {});
}

function sortFields(fields: SchemaFieldItem[]): SchemaFieldItem[] {
  const {
    true: systemFields, false: normalFields,
  } = groupBy(fields, (field) => !!field['x-internal']?.isSystem);
  const sorter = (arr: SchemaFieldItem[]): SchemaFieldItem[] => quickSortObjectArray('x-index', arr);
  return [...sorter(normalFields), ...sorter(systemFields)];
}

type SchemaWithParentPath = ISchema & { parentPathInSchema?: string };
function wrapParentPath(
  properties: Record<string, ISchema>, parentPath: string,
): Record<string, SchemaWithParentPath> {
  const { pipe, entries, fromPairs, map } = fp;
  const transformer = pipe(
    entries,
    map(([fieldKey, fieldSchema]) => {
      fieldSchema.parentPathInSchema = parentPath;
      return [fieldKey, fieldSchema];
    }),
    fromPairs,
  );
  return transformer(properties);
}

function schemaToFields(
  schema?: ISchema,
  filterFunc?: FilterFunc,
  options?: SchemaConvertOptions,
  fields: SchemaFieldItem[] = [],
): Array<SchemaFieldItem> {
  const { properties } = cloneDeep(schema || {});
  if (!properties || isEmpty(properties)) {
    return sortFields(fields);
  }

  const newProperties: ISchema = {
    properties: {},
  };

  Object.keys(properties).forEach((key) => {
    const currentSchema: SchemaWithParentPath = properties[key];
    const componentName = currentSchema['x-component']?.toLowerCase();

    if (!componentName) return;

    const parentField = currentSchema?.['x-internal']?.parentField;
    const tabIndex = currentSchema?.['x-internal']?.tabIndex;
    const subTableSchema = currentSchema.items as ISchema | undefined;
    const isLayoutComponent = currentSchema?.['x-internal']?.isLayoutComponent;

    if (componentName === 'subtable' && subTableSchema) {
      subTableSchema.properties = schemaToMap(subTableSchema, filterFunc, options);
    }

    const originPathInSchema = currentSchema.parentPathInSchema ?
      `${currentSchema.parentPathInSchema}.${key}` : key;
    const field: SchemaFieldItem = {
      ...currentSchema,
      'x-index': numberTransform(currentSchema),
      fieldName: key,
      componentName: componentName || '',
      parentField,
      tabIndex,
      id: key,
      originPathInSchema,
    };

    if (currentSchema.properties && newProperties.properties) {
      newProperties.properties = {
        ...newProperties.properties,
        ...wrapParentPath(currentSchema.properties, isLayoutComponent ? '' : originPathInSchema),
      };
    }

    if (subTableSchema?.properties && newProperties.properties && options?.parseSubTable) {
      newProperties.properties = {
        ...newProperties.properties,
        ...wrapParentPath(subTableSchema.properties, isLayoutComponent ? '' : originPathInSchema),
      };
    }

    if (
      (filterFunc && !filterFunc(currentSchema)) ||
      (!options?.keepLayout && isLayoutComponent)
    ) {
      return;
    }

    fields.push(field);
  });

  return schemaToFields(newProperties, filterFunc, options, fields);
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
