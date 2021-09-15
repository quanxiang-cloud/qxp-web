import logger from '@lib/logger';
import httpClient, { getTableSchema } from '@lib/http-client';

type PageItem = {
  id: string;
  name: string;
}

export function getLinkageTables(appID: string): Promise<Array<LabelValue>> {
  return httpClient<{ pages: PageItem[] }>(
    `/api/v1/structor/${appID}/m/menu/listPage`,
    { appID },
  ).then((res) => {
    if (!res.pages || !res.pages.length) {
      return [];
    }

    return res.pages.map(({ id, name }) => ({ label: name, value: id }));
  }).catch((err) => {
    logger.error(err);
    return [];
  });
}

export { getTableSchema };
