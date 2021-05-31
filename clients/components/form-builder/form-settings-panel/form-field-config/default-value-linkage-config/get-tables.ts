import httpClient from '@lib/http-client';
import logger from '@lib/logger';

type AppPage = {
  id: string;
  name: string;
  child?: AppPage[];
}

function convertPagesToOptions(
  appPages: AppPage[],
  options: Array<{ label: string; value: string }>
): Array<{ label: string; value: string }> {
  appPages.forEach(({ id, name, child }) => {
    options.push({ label: name, value: id });
    if (Array.isArray(child)) {
      convertPagesToOptions(child, options);
    }
  });

  return options;
}

export function getLinkageTables(appID: string): Promise<Array<{ label: string; value: string }>> {
  return httpClient<{ menu: AppPage[] }>(
    `/api/v1/structor/${appID}/${window.SIDE === 'portal' ? 'm' : 'home'}/menu/list`,
    { appID }
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

export function getTableSchema({ appID, tableID }: { appID: string; tableID: string }): Promise<ISchema> {
  return httpClient<{ schema: ISchema }>(
    `/api/v1/structor/${appID}/m/table/getByID`,
    { tableID },
  ).then(({ schema }) => {
    return schema;
  }).catch((err) => {
    logger.error(err);
    return {};
  });
}
