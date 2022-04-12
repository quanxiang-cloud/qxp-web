import httpClient from '@lib/http-client';

function normalizeSuffix(suffix: string): string {
  return suffix.startsWith('/') ? suffix.slice(1) : suffix;
}

export const getTableXName = (
  appID: string,
  data: TableSchemaParam,
): Promise<{ name: string }> => {
  return httpClient(`/api/v1/form/${appID}/m/table/getXName`, data);
};

export function getApiDoc(apiPath: string, data: ApiDocParam): Promise<QueryDocRes> {
  return httpClient(`/api/v1/polyapi/doc/${normalizeSuffix(apiPath)}`, data);
}
