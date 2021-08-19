import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { getTableSchema } from '@lib/http-client';
import schemaToFields from '@lib/schema-convert';

import { LinkedTableFieldOptions } from './index';

const WHITE_LIST_FIELDS = [
  'input',
  'datepicker',
  'numberpicker',
  'radiogroup',
  'multipleselect',
  'checkboxgroup',
  'select',
  'textarea',
  'datepicker',
];

export async function fetchLinkedTableFields(
  appID: string, tableID: string,
): Promise<Array<LinkedTableFieldOptions>> {
  // todo find why this function called and tableID is empty on form submit
  if (!tableID) {
    return Promise.resolve([]);
  }

  const pageSchema = await getTableSchema(appID, tableID);
  const schema = pageSchema?.schema || {};
  const fields = schemaToFields(schema).filter((field) => {
    if (INTERNAL_FIELD_NAMES.includes(field.id)) {
      return false;
    }

    return WHITE_LIST_FIELDS.includes(field.componentName);
  }).map((field) => {
    return {
      value: field.id,
      label: (field.title || field.id) as string,
      fieldEnum: (field.enum || []) as Array<FormBuilder.Option>,
      componentName: field.componentName || 'antdselect',
    };
  });
  return fields;
}
