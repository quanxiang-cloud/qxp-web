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
