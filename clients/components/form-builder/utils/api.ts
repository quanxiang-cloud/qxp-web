import logger from '@lib/logger';
import httpClient, { getTableSchema } from '@lib/http-client';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';

type AppPage = {
  id: string;
  name: string;
  menuType?: number;
  child?: AppPage[];
}

function convertPagesToOptions(
  appPages: AppPage[],
  options: Array<{ label: string; value: string }>,
): Array<{ label: string; value: string }> {
  appPages.forEach(({ id, name, child, menuType }) => {
    if (Array.isArray(child)) {
      convertPagesToOptions(child, options);
      return;
    }

    if (menuType === MenuType.schemaForm) {
      options.push({ label: name, value: id });
    }
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

    return convertPagesToOptions(res.menu, []);
  }).catch((err) => {
    logger.error(err);
    return [];
  });
}

export { getTableSchema };
