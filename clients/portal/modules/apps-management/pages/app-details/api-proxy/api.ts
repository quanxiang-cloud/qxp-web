import httpClient from '@lib/http-client';

type Paging={
  page: number;
  pageSize: number;
}

/*
 namespace apis
 */
export const getGroups = async (): Promise<any> => {
  return await httpClient('');
};

/*
  service apis
 */

/*
  third_party apis
 */
// 创建api，以swagger格式注册原生api
export const createApi = async (servicePath: string, params: PolyAPI.CreateApiParams): Promise<PolyAPI.CreateApiResult> => {
  return await httpClient(`/api/v1/polyapi/raw/reg/${servicePath}`, params);
};

export const getApiList = async (namespacePath: string, params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.ApiInfo>
}> => {
  return await httpClient(`/api/v1/polyapi/raw/list/${namespacePath}`, params);
};
