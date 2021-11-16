import httpClient from '@lib/http-client';

export const savePolyApiResult = async (apiPath: string, arrange: string)
  : Promise<{ data: Record<string, string>, code: any, msg:any }> => {
  return await httpClient(`/api/v1/polyapi/poly/save/${apiPath}`, { arrange });
};
