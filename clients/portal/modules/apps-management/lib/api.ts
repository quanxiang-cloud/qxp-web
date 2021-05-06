import request from './request';

export const fetchAppList = () => {
  return request({
    url: '/api/v1/app-center/adminList',
    method: 'post',
    data: { page: 1, limit: 9999 },
  });
};

export const createdApp = (data: AppInfo) => {
  return request({
    url: '/api/v1/app-center/add',
    method: 'post',
    data,
  });
};

export const updateApp = (data: AppInfo) => {
  return request({
    url: '/api/v1/app-center/update',
    method: 'post',
    data,
  });
};

export const delApp = (id: string) => {
  return request({
    url: '/api/v1/app-center/del',
    method: 'post',
    data: { id },
  });
};

export const updateAppStatus = (data: any) => {
  return request({
    url: '/api/v1/app-center/updateStatus',
    method: 'post',
    data,
  });
};

export const fetchAppDetails = (id: string) => {
  return request({
    url: '/api/v1/app-center/one',
    method: 'post',
    data: { id },
  });
};

export const appAddAdmin = (data: any) => {
  return request({
    url: '/api/v1/app-center/addAdmin',
    method: 'post',
    data,
  });
};

export const fetchAppAdminUsers = (data: any) => {
  return request({
    url: '/api/v1/app-center/adminUsers',
    method: 'post',
    data,
  });
};

export const delAppAdminUsers = (data: any) => {
  return request({
    url: '/api/v1/app-center/delAdmin',
    method: 'post',
    data,
  });
};

export const fetchPageList = (appID: string) => {
  return request({
    url: '/api/v1/structor/menu/list',
    method: 'post',
    data: { appID },
  });
};

export const fetchGroupList = (appID: string) => {
  return request({
    url: '/api/v1/structor/group/list',
    method: 'post',
    data: { appID },
  });
};

export const createPage = (data: PageInfo) => {
  return request({
    url: '/api/v1/structor/menu/create',
    method: 'post',
    data,
  });
};

export const updatePage = (data: PageInfo) => {
  return request({
    url: '/api/v1/structor/menu/update',
    method: 'post',
    data,
  });
};

export const createGroup = (data: any) => {
  return request({
    url: '/api/v1/structor/group/create',
    method: 'post',
    data,
  });
};

export const updateGroup = (data: any) => {
  return request({
    url: '/api/v1/structor/menu/update',
    method: 'post',
    data,
  });
};

export const deleteGroup = (data: any) => {
  return request({
    url: '/api/v1/structor/group/delete',
    method: 'post',
    data,
  });
};

export const deletePage = (data: any) => {
  return request({
    url: '/api/v1/structor/menu/delete',
    method: 'post',
    data,
  });
};

export type MovePageParams = {
  id: string;
  appID: string;
  fromSort: number;
  Name: string;
  toSort: number;
  fromGroupID: string;
  toGroupID: string;
}
export const movePage = (data: MovePageParams) => {
  return request({
    url: '/api/v1/structor/menu/transfer',
    method: 'post',
    data,
  });
};

export const createFormScheme = (data: any) => {
  return request({
    url: '/api/v1/structor/table/create',
    method: 'post',
    data,
  });
};

export const fetchFormScheme = (tableID: string) => {
  return request({
    url: '/api/v1/structor/table/getByID',
    method: 'post',
    data: { tableID },
  });
};

export const updateFormScheme = (data: any) => {
  return request({
    url: '/api/v1/structor/table/update',
    method: 'post',
    data,
  });
};

export const fetchPageFilterScheme = (tableID: string) => {
  return request({
    url: `/api/v1/structor/schema/${tableID}`,
    method: 'post',
  });
};

export const createPageScheme = (data: any) => {
  return request({
    url: '/api/v1/structor/config/create',
    method: 'post',
    data,
  });
};

export const updatePageScheme = (data: any) => {
  return request({
    url: '/api/v1/structor/config/update',
    method: 'post',
    data,
  });
};

export const createPerGroup = (data: RightsCreate) => {
  return request({
    url: '/api/v1/structor/permission/perGroup/create',
    method: 'post',
    data,
  });
};

export const fetchRights = (formID: string) => {
  return request({
    url: '/api/v1/structor/permission/perGroup/getList',
    method: 'post',
    data: { formID },
  });
};

export const deleteRights = (data: any) => {
  return request({
    url: '/api/v1/structor/permission/perGroup/delete',
    method: 'post',
    data,
  });
};

export const movePerGroup = (data: any) => {
  return request({
    url: '/api/v1/structor/permission/perGroup/move',
    method: 'post',
    data,
  });
};

export const updatePerGroup = (data: Rights) => {
  return request({
    url: '/api/v1/structor/permission/perGroup/update',
    method: 'post',
    data,
  });
};

export const fetchOperatePer = (perGroupID: string) => {
  return request({
    url: '/api/v1/structor/permission/operatePer/get',
    method: 'post',
    data: { perGroupID },
  });
};

export const saveOperatePer = (data: any) => {
  return request({
    url: '/api/v1/structor/permission/operatePer/save',
    method: 'post',
    data,
  });
};

export const fetchDataAccessPer = (perGroupID: string) => {
  return request({
    url: '/api/v1/structor/permission/dataAccessPer/get',
    method: 'post',
    data: { perGroupID },
  });
};

export const saveDataAccessPer = (data: any) => {
  return request({
    url: '/api/v1/structor/permission/dataAccessPer/save',
    method: 'post',
    data,
  });
};

export const fetchFieldFilter = (permissionGroupID: string) => {
  return request({
    url: '/api/v1/structor/filter/get',
    method: 'post',
    data: { permissionGroupID },
  });
};

export const saveFieldFilter = (data: any) => {
  return request({
    url: '/api/v1/structor/filter/save',
    method: 'post',
    data,
  });
};

export const formDataCurd = (tableID: string, data: any) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/form/${tableID}`,
    data,
  });
};
