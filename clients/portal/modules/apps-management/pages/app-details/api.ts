import httpClient from '@lib/http-client';

import {
  CardListInfo,
  fetchCustomListRes,
} from './type';

export const fetchAppDetails = async (id: string): Promise<AppInfo> => {
  return await httpClient('/api/v1/app-center/one', { id });
};

export const updateAppStatus = async (data: any)=> {
  return await httpClient('/api/v1/app-center/updateStatus', data);
};

export const updateApp = async (data: Partial<AppInfo> & { id: string })=> {
  return await httpClient('/api/v1/app-center/update', data);
};

export const getUsingList = async (appID: string): Promise<fetchCustomListRes> => {
  return await httpClient(`/api/v1/form/${appID}/m/page/getUsingList`);
};

export const isHiddenMenu = async (appID: string, params?: {id: string, hide: boolean} )=> {
  return await httpClient(`/api/v1/form/${appID}/m/menu/hidden`, params);
};

export const createBlank = async (appID: string): Promise<Record<string, string>> => {
  return await httpClient(`/api/v1/form/${appID}/m/table/createBlank`, {});
};

export const appAddAdmin = async (data: any)=> {
  return await httpClient('/api/v1/app-center/addAdmin', data);
};

export const fetchAppAdminUsers = async (data: any)=> {
  return await httpClient('/api/v1/app-center/adminUsers', data);
};

export const delAppAdminUsers = async (data: any)=> {
  return await httpClient('/api/v1/app-center/delAdmin', data);
};

export const fetchCorrelationFlows = async (
  params: {appID: string, formID: string},
): Promise<CardListInfo[]> => {
  return await httpClient('/api/v1/flow/correlationFlowList', params);
};

export const fetchCorrelationRoles = async (
  appID: string,
  menuID: string,
): Promise<Record<string, CardListInfo[]>> => {
  return await httpClient(`/api/v1/form/${appID}/m/permission/perGroup/getPerGroupByMenu`, { menuID });
};

export const fetchDataModels = (
  appID: string,
  data: DataModelsParameter,
): Promise<DataModelListRes | null> => {
  return httpClient(`/api/v1/form/${appID}/m/table/search`, data);
};

export const formDuplicate = (
  appID: string,
  data: FormDuplicateParameter,
): Promise<{id: string}> => {
  return httpClient(`/api/v1/form/${appID}/m/table/formDuplicate`, data);
};

export const initAppPath = (appID: string): Promise<void> => {
  return httpClient('/api/v1/polyapi/namespace/initAppPath', { data: { appID } });
};
