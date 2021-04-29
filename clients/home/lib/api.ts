import request from '@appLib/request';

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
    url: '/api/v1/structor/menu/list',
    data: { appID },
  });
};

export const fetchFormScheme = (tableID: string) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/schema/${tableID}`,
  });
};

export const formDataCurd = (tableID: string, data: any) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/form/${tableID}`,
    data,
  });
};
