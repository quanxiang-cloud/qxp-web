import httpClient from '@lib/http-client';

export const getTableXName = (
  appID: string,
  data: getTableSchemaParam,
): Promise<{name: string}> => {
  return httpClient(`/api/v1/structor/${appID}/m/table/getXName`, data);
};

export const getApiDoc = (data: getApiDocParam): Promise<QueryDocRes> => {
  return httpClient('/api/v1/polyapi/raw/queryDoc', data);
};
