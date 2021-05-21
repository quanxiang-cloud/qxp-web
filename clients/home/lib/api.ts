import request from '@portal/modules/apps-management/lib/request';

export const fetchUserList = () => {
  return request({
    method: 'post',
    url: '/api/v1/app-center/userList',
    data: { page: 1, limit: 9999 },
  });
};

export const fetchPageList = (appID: string) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/${appID}/menu/user/list`,
    data: { appID },
  });
};

export const fetchFormScheme = (appID: string, tableID: string) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/${appID}/schema/${tableID}`,
  });
};

export const formDataCurd = (appID: string, tableID: string, data: any) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/${appID}/form/${tableID}`,
    data,
  });
};
