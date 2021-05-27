import request from '@portal/modules/apps-management/lib/request';

export const fetchAppDetails = (id: string) => {
  return request({
    url: '/api/v1/app-center/one',
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

export const updateApp = (data: AppInfo) => {
  return request({
    url: '/api/v1/app-center/update',
    method: 'post',
    data,
  });
};

export const fetchPageList = (appID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/menu/list`,
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

export const fetchFormScheme = (appID: string, tableID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/table/getByID`,
    method: 'post',
    data: { tableID },
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

export const fetchGroupList = (appID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/group/list`,
    method: 'post',
    data: { appID },
  });
};
