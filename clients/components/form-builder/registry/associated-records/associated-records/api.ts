import { fetchFormDataList, FormDataListResponse } from '@lib/http-client';
import { operatorESParameter } from '@c/data-filter/utils';
import logger from '@lib/logger';

export function findTableRecords(
  appID: string,
  tableID: string,
  ids: string[],
): Promise<Array<Record<string, any>>> {
  if (!ids.length) {
    return Promise.resolve([]);
  }

  return fetchFormDataList(appID, tableID, {
    query: { bool: { must: [operatorESParameter('_id', 'intersection', ids)] } },
  }).then((res) => {
    return res.entities || [];
  }).catch((err) => {
    logger.error(err);
    return [];
  });
}

export async function fetchTableData(
  appID: string,
  tableID: string,
  page: number,
  size: number,
): Promise<FormDataListResponse | null> {
  return fetchFormDataList(appID, tableID, { page, size });
}
