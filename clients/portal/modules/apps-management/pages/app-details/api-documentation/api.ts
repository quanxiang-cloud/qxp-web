import httpClient from '@lib/http-client';

export const getTableXName = (
  appID: string,
  data: TableSchemaParam,
): Promise<{name: string}> => {
  return httpClient(`/api/v1/structor/${appID}/m/table/getXName`, data);
};

export const getApiDoc = (apiPath: string, data: ApiDocParam): Promise<QueryDocRes> => {
  return httpClient(`/api/v1/polyapi/raw/doc${apiPath}`, data);
};
