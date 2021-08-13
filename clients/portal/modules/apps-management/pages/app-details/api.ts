import httpClient from '@lib/http-client';

import { MovePageParams, CustomPageParams, fetchCustomListRes } from './type';

export const fetchAppDetails = async (id: string)=> {
  return await httpClient('/api/v1/app-center/one', { id });
};

export const updateAppStatus = async (data: any)=> {
  return await httpClient('/api/v1/app-center/updateStatus', data);
};

export const updateApp = async (data: AppInfo)=> {
  return await httpClient('/api/v1/app-center/update', data);
};

export const fetchPageList = async (appID: string)=> {
  return await httpClient(`/api/v1/structor/${appID}/m/menu/list`, { appID });
};

export const fetchCustomPageList = async (appID: string, params?: CustomPageParams):Promise<fetchCustomListRes> => {
  return await httpClient(`/api/v1/structor/${appID}/m/page/condition`, params);
};

export const createPage = async (data: PageInfo)=> {
  return await httpClient(`/api/v1/structor/${data.appID}/m/menu/create`, data);
};

export const updatePageOrGroup = async (data: PageInfo)=> {
  return await httpClient(`/api/v1/structor/${data.appID}/m/menu/update`, data);
};

export const createGroup = async (data: any)=> {
  return await httpClient(`/api/v1/structor/${data.appID}/m/group/create`, data);
};

export const deleteGroup = async (data: any)=> {
  return await httpClient(`/api/v1/structor/${data.appID}/m/group/delete`, data);
};

export const deletePage = async (data: any)=> {
  return await httpClient(`/api/v1/structor/${data.appID}/m/menu/delete`, data);
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
  return await httpClient(`/api/v1/structor/${data.appID}/m/menu/transfer`, data);
};

export const fetchGroupList = async (appID: string)=> {
  return await httpClient(`/api/v1/structor/${appID}/m/group/list`, { appID });
};

export const createCustomPage = async (appID: string, params: CustomPageParams)=> {
  return await httpClient(`/api/v1/structor/${appID}/m/page/create`, params);
};

export const removeCustomPage = async (appID: string, pageId: string)=> {
  return await httpClient(`/api/v1/structor/${appID}/m/page/delete`, { id: pageId });
};

export const editeCustomPage = async (appID: string, params: CustomPageParams)=> {
  return await httpClient(`/api/v1/structor/${appID}/m/page/update`, params);
};

export const fetchDataModels = (
  appID: string,
  data: DataModelsParameter,
): Promise<DataModelListRes | null> => {
  return httpClient(`/api/v1/structor/${appID}/m/table/search`, data);
};
