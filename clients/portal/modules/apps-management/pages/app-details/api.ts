import httpClient from '@lib/http-client';

import {
  CardListInfo,
  CustomPageInfo,
  MovePageParams,
  CustomPageParams,
  fetchCustomListRes,
  UpdateCustomPageParams,
  CreateCustomPageParams,
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
window.updateApp = updateApp;

export const fetchCustomPageList = async (appID: string, params?: CustomPageParams): Promise<fetchCustomListRes> => {
  return await httpClient(`/api/v1/form/${appID}/m/page/condition`, params);
};

export const getUsingList = async (appID: string): Promise<fetchCustomListRes> => {
  return await httpClient(`/api/v1/form/${appID}/m/page/getUsingList`);
};

export const isHiddenMenu = async (appID: string, params?: {id: string, hide: boolean} )=> {
  return await httpClient(`/api/v1/form/${appID}/m/menu/hidden`, params);
};

export const createPage = async (data: Partial<PageInfo>): Promise<{id: string}>=> {
  return await httpClient(`/api/v1/form/${data.appID}/m/menu/create`, data);
};

export const createBlank = async (appID: string): Promise<Record<string, string>> => {
  return await httpClient(`/api/v1/form/${appID}/m/table/createBlank`, {});
};

export const updatePageOrGroup = async (data: PageInfo)=> {
  return await httpClient(`/api/v1/form/${data.appID}/m/menu/update`, data);
};

export const createGroup = async (data: any)=> {
  return await httpClient(`/api/v1/form/${data.appID}/m/group/create`, data);
};

export const deleteGroup = async (data: any)=> {
  return await httpClient(`/api/v1/form/${data.appID}/m/group/delete`, data);
};

export const deletePage = async (data: any)=> {
  return await httpClient(`/api/v1/form/${data.appID}/m/menu/delete`, data);
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

export const movePage = async (data: MovePageParams)=> {
  return await httpClient(`/api/v1/form/${data.appID}/m/menu/transfer`, data);
};

export const fetchGroupList = async (appID: string)=> {
  return await httpClient(`/api/v1/form/${appID}/m/group/list`, { appID });
};

export const createCustomPage = async (
  appID: string, params: CreateCustomPageParams,
): Promise<CustomPageInfo> => {
  return await httpClient(`/api/v1/form/${appID}/m/page/create`, params);
};

export const updateCustomPage = async (
  appID: string, params: UpdateCustomPageParams,
): Promise<CustomPageInfo> => {
  return await httpClient(`/api/v1/form/${appID}/m/page/update`, params);
};

export const removeCustomPage = async (appID: string, pageId: string)=> {
  return await httpClient(`/api/v1/form/${appID}/m/page/delete`, { id: pageId });
};

export const editeCustomPage = async (appID: string, params: CustomPageParams)=> {
  return await httpClient(`/api/v1/form/${appID}/m/page/update`, params);
};

export const relateCustomPage = async (
  appID: string, params: {menuId: string, pageID: string},
): Promise<CustomPageInfo> => {
  return await httpClient(`/api/v1/form/${appID}/m/page/relate`, params);
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
