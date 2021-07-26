import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { getTableSchema } from '@lib/http-client';

import { LinkedTableFieldOptions } from './index';

const WHITE_LIST_FIELDS = [
  'Input',
  'DatePicker',
  'NumberPicker',
  'RadioGroup',
  'MultipleSelect',
  'CheckboxGroup',
  'Select',
];

export function fetchLinkedTableFields(
  appID: string, tableID: string,
): Promise<Array<LinkedTableFieldOptions>> {
  // todo find why this function called and tableID is empty on form submit
  if (!tableID) {
    return Promise.resolve([]);
  }

  return getTableSchema(appID, tableID).then((pageSchema) => {
    const schema = pageSchema?.schema || {};
    const fields = Object.entries(schema?.properties || {}).filter(([key, fieldSchema]) => {
      if (INTERNAL_FIELD_NAMES.includes(key)) {
        return false;
      }

      return WHITE_LIST_FIELDS.includes(fieldSchema['x-component'] || '');
    }).map(([key, fieldSchema]) => {
      return {
        value: key,
        label: (fieldSchema.title || key) as string,
        fieldEnum: (fieldSchema.enum || []) as Array<FormBuilder.Option>,
        'x-component': fieldSchema['x-component'] || 'AntdSelect',
      };
    });

    return fields;
  });
}
