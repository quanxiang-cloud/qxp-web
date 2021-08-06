import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

import { not } from '@lib/utils';
import { Option } from '@portal/modules/work-flow/content/editor/forms/api';

type FilterFunc = (currentSchema: ISchema) => boolean;

export function schemaToOptions(schema?: ISchema, filterFunc?: FilterFunc): Option[] {
  return schemaToFields(schema, filterFunc).map((field: SchemaFieldItem) => ({
    label: field.title as string,
    value: field.id,
    type: field.type as string,
    isSystem: field['x-internal']?.isSystem,
  }));
}

export function isLayoutComponent(currentSchema: ISchema): boolean {
  return !!currentSchema?.isLayoutComponent;
}

export const notIsLayoutComponent = not(isLayoutComponent);

export function schemaToMap(schema?: ISchema, filterFunc?: FilterFunc): Record<string, SchemaFieldItem> {
  const fields = schemaToFields(schema, filterFunc ? filterFunc : notIsLayoutComponent);
  return fields.reduce((fieldsMap: Record<string, SchemaFieldItem>, field: SchemaFieldItem) => {
    fieldsMap[field.fieldName] = field;
    return fieldsMap;
  }, {});
}

const schemaToFields = (
  schema?: ISchema, filterFunc?: FilterFunc, fields: SchemaFieldItem[] = [],
): Array<SchemaFieldItem> => {
  const { properties } = cloneDeep(schema || {});
  if (!properties || isEmpty(properties)) return fields;

  const newProperties: ISchema = {
    properties: {},
  };
  Object.keys(properties).forEach((key) => {
    const currentSchema: ISchema = properties[key];
    const componentName = currentSchema['x-component']?.toLowerCase();

    if (!componentName) return;

    const isLayoutComponent = !!currentSchema?.isLayoutComponent;
    const parentField = currentSchema?.['x-internal']?.parentField;
    const tabIndex = currentSchema?.['x-internal']?.tabIndex;
    const xIndex = currentSchema?.['x-index'];

    if (componentName === 'subtable') {
      const items = currentSchema.items as ISchema;
      items.properties = schemaToMap(items, filterFunc);
    }

    const field = {
      ...currentSchema,
      fieldName: key,
      componentName: componentName,
      isLayoutComponent,
      parentField,
      tabIndex,
      'x-index': xIndex,
      id: key,
    };

    if (currentSchema.properties && newProperties.properties) {
      newProperties.properties = Object.assign(newProperties.properties, currentSchema.properties);
    }

    if (filterFunc && !filterFunc(currentSchema)) return;

    fields.push(field);
  });

  return schemaToFields(newProperties, filterFunc, fields);
};

export const fieldsToSchema = (fields: Array<SchemaFieldItem>): ISchema => {
  const properties: Record<string, ISchema> = {};

  fields.forEach((field) => {
    const fileName = field.fieldName;

    if (field.parentField) return;

    properties[fileName] = {
      ...field,
      properties: {},
    };
  });

  fields.forEach((field) => {
    const fileName = field.fieldName;

    if (!field.parentField) return;

    const parentProperties = properties[field.parentField].properties;

    if (parentProperties === undefined) return;

    parentProperties[fileName] = field;
  });

  return {
    type: 'object',
    title: '',
    properties,
  };
};

export default schemaToFields;
