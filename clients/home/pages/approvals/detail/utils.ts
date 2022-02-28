import { get } from 'lodash';

import { getTableSchema } from '@lib/http-client';
import { schemaToMap } from '@lib/schema-convert';

const COMPONENT_VALUE_ARRAY = [
  'checkboxgroup', 'multipleselect', 'userpicker', 'organizationpicker', 'imageupload', 'associatedrecords',
];

export async function validateTaskFrom(schema: ISchema, formData: Record<string, unknown>): Promise<boolean> {
  const schemaMap = schemaToMap(schema, (processSchema: SchemaFieldItem) =>
    (!!processSchema.required && processSchema['x-internal']?.permission === 11) || processSchema.componentName === 'subtable');

  for (const [fieldKey, fieldValue] of Object.entries(schemaMap)) {
    if (fieldValue.componentName === 'subtable') {
      const isValidate = await validateSubtable(formData, fieldKey, fieldValue);
      if (!isValidate) {
        return false;
      }
    }

    if (
      COMPONENT_VALUE_ARRAY.includes(fieldValue.componentName) &&
        !(get(formData, fieldKey, []) as Array<any>).length
    ) {
      return false;
    }

    if (
      fieldValue.componentName === 'cascadeselector' && !(get(formData, fieldKey, {}) as LabelValue).value
    ) {
      return false;
    }

    if (
      !COMPONENT_VALUE_ARRAY.includes(fieldValue.componentName) && !get(formData, fieldKey, '')
    ) {
      return false;
    }
  }

  return true;
}

async function validateSubtable(
  formData: Record<string, unknown>, fieldKey: string, fieldValue: SchemaFieldItem,
): Promise<boolean> {
  const subordination = fieldValue['x-component-props']?.subordination;
  const subtableValue = get(formData, fieldKey, []) as Array<string>;
  const subtableField = get(fieldValue, 'items.properties', {}) as Record<string, SchemaFieldItem>;

  if (subordination === 'foreign_table') {
    const appId = get(fieldValue, 'x-component-props.appID', '');
    const targetTableId = get(fieldValue, 'x-component-props.tableID', '');
    const foreignTableFields = get(fieldValue, 'x-component-props.columns', []);
    const res = await getTableSchema(appId, targetTableId);
    const foreignTableSchema = res?.schema || {};
    const foreignTableSchemaMap = schemaToMap(foreignTableSchema,
      (currentSchema: SchemaFieldItem) => {
        return !!currentSchema.required && currentSchema['x-internal']?.permission === 11;
      },
    );

    for (const foreignKey of Object.keys(foreignTableSchemaMap)) {
      if (!foreignTableFields.includes(foreignKey)) {
        continue;
      }

      for (const subValItem of subtableValue) {
        if (!get(subValItem, foreignKey, '')) {
          return false;
        }
      }
    }
  }

  for (const [subKey, subValue] of Object.entries(subtableField)) {
    if (!(subValue.required && subValue['x-internal']?.permission === 11)) {
      continue;
    }

    for (const subValItem of subtableValue) {
      if (!get(subValItem, subKey, '')) {
        return false;
      }
    }
  }
  return true;
}
