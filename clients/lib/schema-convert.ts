import { isEmpty } from 'lodash';

import { not } from '@lib/utils';

type Field = {
  [key: string]: any;
}

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

type FilterFunc = (field: ISchema) => boolean

export function schemaToOptions(schema: ISchema, filterFunc?: FilterFunc): Options {
  return schemaToFields(schema, filterFunc).map((field: Field)=> ({
    label: field.title as string,
    value: field.id,
    type: field.type as string,
    isSystem: field['x-internal']?.isSystem,
  }));
}

export function isLayoutComponent(field: Field): boolean {
  return field.isLayoutComponent;
}

export const notIsLayoutComponent = not(isLayoutComponent);

export function schemaToMap(schema: ISchema, filterFunc?: FilterFunc): Record<string, Field> {
  const fields = schemaToFields(schema, filterFunc);
  return fields.reduce((fieldsMap: Record<string, Field>, field: Field) => {
    fieldsMap[field.fieldName] = field;
    return fieldsMap;
  }, {});
}

const schemaToFields = (
  { properties }: ISchema, filterFunc?: FilterFunc, fields: Field[] = [],
): Array<Field> => {
  if (!properties || isEmpty(properties)) return fields;

  const newProperties: ISchema = {
    properties: {},
  };

  Object.keys(properties).forEach((key) => {
    const currentSchema: ISchema = properties[key];
    const componentName = currentSchema['x-component']?.toLowerCase();

    if (!componentName) return;

    const isLayoutComponent = currentSchema?.isLayoutComponent;
    const parentField = currentSchema?.['x-internal']?.parentField;
    const tabIndex = currentSchema?.['x-internal']?.tabIndex;
    const xIndex = currentSchema?.['x-index'];

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

export const fieldsToSchema = (fields: Array<Field>): ISchema => {
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
