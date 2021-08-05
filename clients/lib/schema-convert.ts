import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';

import { not } from '@lib/utils';

export type Properties = {
  [key: string]: ISchema;
}

export type Option = {
  label: string;
  value: string;
  children?: Option[];
  type?: string;
  isSystem?: boolean;
};

export type Options = Option[];

type FilterFunc = (currentSchema: ISchema) => boolean

export function schemaToOptions(schema?: ISchema, filterFunc?: FilterFunc): Options {
  return schemaToFields(schema, filterFunc).map((field: SchemaField) => ({
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

export function schemaToMap(schema?: ISchema, filterFunc?: FilterFunc): Record<string, SchemaField> {
  const fields = schemaToFields(schema, filterFunc);
  return fields.reduce((fieldsMap: Record<string, SchemaField>, field: SchemaField) => {
    fieldsMap[field.fieldName] = field;
    return fieldsMap;
  }, {});
}

const schemaToFields = (
  schema?: ISchema, filterFunc?: FilterFunc, fields: SchemaField[] = [],
): Array<SchemaField> => {
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

export const fieldsToSchema = (fields: Array<SchemaField>): ISchema => {
  const properties: Properties = {};

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

/**
 * expand the internal properties of the layout component
 * @param {ISchema} properties:ISchema schema结构
 * @return {ISchema} flatProperties 展开的是properties结构
 */
export function propertiesFlat(properties: ISchema | undefined): Properties {
  const formatSchema = (schemaObj: { [key: string]: ISchema[] }): { [key: string]: ISchema } => {
    const tmpObj: { [key: string]: ISchema } = {};
    Object.entries(schemaObj).map(([key, schema]) => {
      tmpObj[key] = Array.isArray(schema) ? schema[0] : schema;
    });

    return tmpObj || {};
  };

  return formatSchema(groupBy(schemaToFields({ properties } as ISchema), 'id'));
}
