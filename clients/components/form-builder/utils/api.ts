import httpClient, { getTableSchema } from '@lib/http-client';
import logger from '@lib/logger';

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

export function getTableFieldsToOptions(
  appID: string,
  tableID: string,
  filterArr?: string[],
): Promise<LabelValue[]> {
  return getTableSchema(appID, tableID).then((res) => {
    if (res?.schema.properties) {
      return Object.entries(res?.schema.properties).reduce((acc, [key, fieldSchema]) => {
        if ((filterArr && !filterArr.includes(fieldSchema['x-component'] as string)) || key === '_id') {
          return acc;
        }

        return acc.concat([{ label: fieldSchema.title as string, value: key }]);
      }, [] as LabelValue[]);
    }

    return [];
  });
}

export { getTableSchema };
