import httpClient from '@lib/http-client';

type Paging={
  page: number;
  pageSize: number;
}

type AppPathType = 'root' | 'raw' | 'poly' | 'serviceForm' | 'form' | 'custom';

function normalizeSuffix(suffix: string): string {
  return suffix.startsWith('/') ? suffix.slice(1) : suffix;
}

/*
 namespace crud apis
 */
export const createNamespace = async (namespace: string, params: PolyAPI.CreateNamespaceParams): Promise<PolyAPI.Namespace> => {
  return await httpClient(`/api/v1/polyapi/namespace/create/${normalizeSuffix(namespace)}`, params);
};

export const deleteNamespace = async (ns: string): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/namespace/delete/${normalizeSuffix(ns)}`);
};

export const updateNamespace = async (ns: string, params: Omit<PolyAPI.CreateNamespaceParams, 'name'>): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/namespace/update/${normalizeSuffix(ns)}`, params);
};

export const activateNamespace = async (namespacePath: string, params: {active: number}): Promise<{fullPath: string; active: number}> => {
  return await httpClient(`/api/v1/polyapi/namespace/active/${namespacePath}`, params);
};

export const getNamespaceList = async (namespacePath = '', params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.Namespace>
}>=> {
  return await httpClient(`/api/v1/polyapi/namespace/list/${normalizeSuffix(namespacePath)}`, params);
};

export const getNamespace = async (namespacePath: string): Promise<PolyAPI.Namespace> => {
  return await httpClient(`/api/v1/polyapi/namespace/query/${namespacePath}`);
};

export const getAppPath = async (appID: string, pathType: AppPathType = 'raw'): Promise<{appID: string, pathType: string, appPath: string}> => {
  return await httpClient('/api/v1/polyapi/namespace/appPath', { appID, pathType });
};

export const searchNamespace = async (ns: string, params: Record<string, any>): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.Namespace>
}> => {
  const defaultParams = { active: -1, page: 1, pageSize: -1, withSub: true };
  return await httpClient(`/api/v1/polyapi/namespace/search/${normalizeSuffix(ns)}`, { ...params, ...defaultParams });
};

/*
  service crud apis
 */
export const createService = async (ns:string, params: PolyAPI.CreateServiceParams): Promise<PolyAPI.CreateServiceResult> => {
  return await httpClient(`/api/v1/polyapi/service/create/${normalizeSuffix(ns)}`, params);
};

export const deleteService = async (servicePath: string): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/service/delete/${servicePath}`);
};

export const updateService = async (servicePath: string, params: Omit<PolyAPI.CreateServiceParams, 'name'>): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/service/updateProperty/${normalizeSuffix(servicePath)}`, params);
};

// 激活服务
export const activateService = async (servicePath: string, params: {active: number}): Promise<{fullPath: string; active: number}> => {
  return await httpClient(`/api/v1/polyapi/service/active/${servicePath}`, params);
};

export const getServiceList = async (namespacePath: string, params?: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.Service>
}> => {
  return await httpClient(`/api/v1/polyapi/service/list/${normalizeSuffix(namespacePath)}`, params || {});
};

export const getService = async (servicePath: string): Promise<PolyAPI.Service> => {
  return await httpClient(`/api/v1/polyapi/service/query/${normalizeSuffix(servicePath)}`);
};

/*
  third_party apis
 */
// 创建api，以swagger格式注册原生api
export const registerApi = async (servicePath: string, params: PolyAPI.CreateApiParams): Promise<PolyAPI.CreateApiResult> => {
  return await httpClient(`/api/v1/polyapi/raw/reg/${normalizeSuffix(servicePath)}`, params);
};

export const uploadSwagger = async (servicePath: string, params: PolyAPI.UploadApiParams): Promise<PolyAPI.CreateApiResult> => {
  return await httpClient(`/api/v1/polyapi/raw/upload/${servicePath}`, params);
};

export const getNamespaceApiList = async (namespacePath: string, params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.Api>
}> => {
  return await httpClient(`/api/v1/polyapi/raw/list/${normalizeSuffix(namespacePath)}`, params);
};

export const getServiceApiList = async (servicePath: string, params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.Api>
}> => {
  return await httpClient(`/api/v1/polyapi/raw/listInService/${normalizeSuffix(servicePath)}`, params);
};

export const queryNativeApi = async (apiPath: string): Promise<PolyAPI.NativeApi>=> {
  return await httpClient(`/api/v1/polyapi/raw/query/${apiPath}`);
};

export const deleteNativeApi = async (apiPath: string): Promise<any> => {
  return await httpClient(`/api/v1/polyapi/raw/delete/${apiPath}`);
};

export const queryNativeApiDoc = async (apiPath: string, params: PolyAPI.ApiDocParams): Promise<PolyAPI.QueryApiDocResult> => {
  return await httpClient(`/api/v1/polyapi/raw/doc/${apiPath}`, params);
};

// 第三方api密钥管理
export const uploadApiKey = async (params: PolyAPI.ApiKeyParams): Promise<any> => {
  return await httpClient('/api/v1/polyapi/holdingkey/upload', params);
};

export const deleteApiKey = async (params: { id: string; service?: string }): Promise<any> => {
  return await httpClient('/api/v1/polyapi/holdingkey/delete', params);
};

export const updateApiKey = async (params: PolyAPI.ApiKeyParams): Promise<any> => {
  return await httpClient('/api/v1/polyapi/holdingkey/update', params);
};

export const getApiKeyList = async (params: { page: number, limit: number, service?: string }): Promise<{
  keys: Array<PolyAPI.ApiKeyList>,
  total: number,
}> => {
  return await httpClient('/api/v1/polyapi/holdingkey/list', params);
};

export const queryApiKey = async ( id: string ): Promise<PolyAPI.ApiKeyList> => {
  return await httpClient('/api/v1/polyapi/holdingkey/query', { id });
};

export const activeApiKey = async (params: { id: string; active: number; service?: string }): Promise<any> => {
  return await httpClient('/api/v1/polyapi/holdingkey/active', params);
};
