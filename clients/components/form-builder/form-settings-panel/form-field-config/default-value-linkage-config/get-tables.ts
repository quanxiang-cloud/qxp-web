import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import httpClient, { getTableSchema } from '@lib/http-client';
import logger from '@lib/logger';

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

type AppPage = {
  id: string;
  name: string;
  child?: AppPage[];
}

function convertPagesToOptions(
  appPages: AppPage[],
  options: Array<{ label: string; value: string }>,
): Array<{ label: string; value: string }> {
  appPages.forEach(({ id, name, child }) => {
    if (Array.isArray(child)) {
      convertPagesToOptions(child, options);
      return;
    }
    options.push({ label: name, value: id });
  });

  return options;
}

export function getLinkageTables(appID: string): Promise<Array<{ label: string; value: string }>> {
  return httpClient<{ menu: AppPage[] }>(
    `/api/v1/structor/${appID}/m/menu/list`,
    { appID },
  ).then((res) => {
    if (!res.menu || !res.menu.length) {
      return [];
    }

    const appPages = res.menu;
    return convertPagesToOptions(appPages, []);
  }).catch((err) => {
    logger.error(err);
    return [];
  });
}

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
