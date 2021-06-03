import httpClient from '@lib/http-client';
import logger from '@lib/logger';

type FormDataRequestQueryParams = {
  method: 'find';
  conditions: {
    condition: Array<{ key: string; op: string; value: Array<string | number>; }>;
    tag: 'and',
  }
}

type FormDataResponse = { entities: Array<Record<string, any>>; total: number; };

export function findTableRecords(
  appID: string,
  tableID: string,
  ids: string[],
): Promise<Array<Record<string, any>>> {
  if (!ids.length) {
    return Promise.resolve([]);
  }

  const params: FormDataRequestQueryParams = {
    method: 'find',
    conditions: {
      condition: [{ key: '_id', op: 'in', value: ids }],
      tag: 'and',
    },
  };

  return httpClient<FormDataResponse>(
    `/api/v1/structor/${appID}/home/form/${tableID}`,
    params,
  ).then(({ entities }) => entities).catch((err) => {
    logger.error(err);
    return [];
  });
}

export function fetchTableData(
  appID: string,
  tableID: string,
  pageNumber: number,
  pageSize: number,
) {
  return httpClient<FormDataResponse>(
    `/api/v1/structor/${appID}/home/form/${tableID}`,
    { method: 'find', page: pageNumber, size: pageSize },
  ).catch((err) => {
    logger.error(err);
    return null;
  });
}
