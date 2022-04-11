import logger from '@lib/logger';
import httpClient, { getTableSchema } from '@lib/http-client';

type TableInfo = {
  tableID: string;
  title: string;
}

export function getLinkageTables(appID: string): Promise<Array<LabelValue>> {
  return httpClient<{ list: TableInfo[] }>(
    `/api/v1/form/${appID}/m/table/search`,
    { appID },
  ).then(({ list }) => {
    if (!list || !list.length) {
      return [];
    }

    return list.map(({ tableID, title }) => ({ label: title, value: tableID }));
  }).catch((err) => {
    logger.error(err);
    return [];
  });
}

export { getTableSchema };
