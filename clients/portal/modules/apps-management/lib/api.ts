import request from './request';

export const fetchAppList = (data: any) => {
  return request({
    url: '/api/v1/app-center/adminList',
    method: 'post',
    data: { page: 1, limit: 9999, ...data },
  });
};

export const createdApp = (data: AppInfo) => {
  return request({
    url: '/api/v1/app-center/add',
    method: 'post',
    data,
  }).then((res) => {
    createPage({ describe: '补充说明信息。', icon: 'event_available', name: '示例页面', appID: res.data.id, id: '' });
    return res;
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
    url: `/api/v1/structor/${appID}/menu/list`,
    method: 'post',
    data: { appID },
  });
};

export const fetchGroupList = (appID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/group/list`,
    method: 'post',
    data: { appID },
  });
};

export const createPage = (data: PageInfo) => {
  return request({
    url: `/api/v1/structor/${data.appID}/menu/create`,
    method: 'post',
    data,
  });
};

export const updatePageOrGroup = (data: PageInfo) => {
  return request({
    url: `/api/v1/structor/${data.appID}/menu/update`,
    method: 'post',
    data,
  });
};

export const createGroup = (data: any) => {
  return request({
    url: `/api/v1/structor/${data.appID}/group/create`,
    method: 'post',
    data,
  });
};

export const deleteGroup = (data: any) => {
  return request({
    url: `/api/v1/structor/${data.appID}/group/delete`,
    method: 'post',
    data,
  });
};

export const deletePage = (data: any) => {
  return request({
    url: `/api/v1/structor/${data.appID}/menu/delete`,
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
    url: `/api/v1/structor/${data.appID}/menu/transfer`,
    method: 'post',
    data,
  });
};

export const createFormScheme = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/table/create`,
    method: 'post',
    data,
  });
};

export const fetchFormScheme = (appID:string, tableID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/table/getByID`,
    method: 'post',
    data: { tableID },
  });
};

export const updateFormScheme = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/table/update`,
    method: 'post',
    data,
  });
};

export const createPageScheme = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/config/create`,
    method: 'post',
    data,
  });
};

export const createPerGroup = (appID: string, data: RightsCreate) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/create`,
    method: 'post',
    data,
  });
};

export const fetchRights = (appID: string, formID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/getList`,
    method: 'post',
    data: { formID },
  });
};

export const deleteRights = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/delete`,
    method: 'post',
    data,
  });
};

export const movePerGroup = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/move`,
    method: 'post',
    data,
  });
};

export const updatePerGroup = (appID: string, data: Rights) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/update`,
    method: 'post',
    data,
  });
};

export const fetchOperatePer = (appID: string, perGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/operatePer/get`,
    method: 'post',
    data: { perGroupID },
  });
};

export const saveOperatePer = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/operatePer/save`,
    method: 'post',
    data,
  });
};

export const fetchDataAccessPer = (appID: string, perGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/dataAccessPer/get`,
    method: 'post',
    data: { perGroupID },
  });
};

export const saveDataAccessPer = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/dataAccessPer/save`,
    method: 'post',
    data,
  });
};

export const fetchFieldFilter = (appID: string, permissionGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/filter/get`,
    method: 'post',
    data: { permissionGroupID },
  });
};

export const saveFieldFilter = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/filter/save`,
    method: 'post',
    data,
  });
};

