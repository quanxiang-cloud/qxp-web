import httpClient from '@lib/http-client';

type Paging={
  page: number;
  pageSize: number;
}

type AppPathType = 'root' | 'raw' | 'poly' | 'serviceForm' | 'form' | 'custom';

/*
 namespace crud apis
 */
export const createNamespace = async (namespace: string, params: PolyAPI.CreateNamespaceParams): Promise<PolyAPI.NamespaceInfo> => {
  return await httpClient(`/api/v1/polyapi/namespace/create/${namespace}`, params);
};

export const deleteNamespace = async (namespacePath: string): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/namespace/delete/${namespacePath}`);
};

export const updateNamespace = async (namespacePath: string, params: {title: string; desc: string}): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/namespace/update/${namespacePath}`, params);
};

export const activateNamespace = async (namespacePath: string, params: {active: number}): Promise<{fullPath: string; active: number}> => {
  return await httpClient(`/api/v1/polyapi/namespace/active/${namespacePath}`, params);
};

export const getNamespaceList = async (namespacePath: string, params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.NamespaceInfo & {parent: string; name: string}>
}>=> {
  return await httpClient(['/api/v1/polyapi/namespace/list', namespacePath].join('/'), params);
};

export const getNamespace = async (namespacePath: string): Promise<PolyAPI.NamespaceInfo & {parent: string; name: string}> => {
  return await httpClient(`/api/v1/polyapi/namespace/query/${namespacePath}`);
};

export const getAppPath = async (appID: string, pathType: AppPathType = 'root'): Promise<{appID: string, pathType: string, appPath: string}> => {
  return await httpClient('/api/v1/polyapi/namespace/appPath', { appID, pathType });
};

/*
  service crud apis
 */
export const createService = async (namespacePath:string, params: PolyAPI.CreateServiceParams): Promise<PolyAPI.CreateServiceResult> => {
  return await httpClient(`/api/v1/polyapi/service/create/${namespacePath}`, params);
};

export const deleteService = async (servicePath: string): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/service/delete/${servicePath}`);
};

export const updateService = async (servicePath: string, params: {title: string; desc: string}): Promise<{fullPath: string}> => {
  return await httpClient(`/api/v1/polyapi/service/update/${servicePath}`, params);
};

// 激活服务
export const activateService = async (servicePath: string, params: {active: number}): Promise<{fullPath: string; active: number}> => {
  return await httpClient(`/api/v1/polyapi/service/active/${servicePath}`, params);
};

export const getServiceList = async (namespacePath?: string, params?: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.ServiceInfo>
}> => {
  return await httpClient(['/api/v1/polyapi/service/list', namespacePath || ''].join('/'), params || {});
};

export const getService = async (servicePath: string): Promise<PolyAPI.ServiceInfo> => {
  return await httpClient(`/api/v1/polyapi/service/query/${servicePath}`);
};

/*
  third_party apis
 */
// 创建api，以swagger格式注册原生api
export const registerApi = async (servicePath: string, params: PolyAPI.CreateApiParams): Promise<PolyAPI.CreateApiResult> => {
  return await httpClient(`/api/v1/polyapi/raw/reg/${servicePath}`, params);
};

export const uploadSwagger = async (servicePath: string, params: PolyAPI.UploadApiParams): Promise<PolyAPI.CreateApiResult> => {
  return await httpClient(`/api/v1/polyapi/raw/upload/${servicePath}`, params);
};

export const getNamespaceApiList = async (namespacePath: string, params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.ApiInfo>
}> => {
  return await httpClient(`/api/v1/polyapi/raw/list/${namespacePath}`, params);
};

export const getServiceApiList = async (servicePath: string, params: Paging): Promise<{
  total: number;
  page: number;
  list: Array<PolyAPI.ApiInfo>
}> => {
  return await httpClient(`/api/v1/polyapi/raw/listInService/${servicePath}`, params);
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
