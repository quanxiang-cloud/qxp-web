import request from '@portal/modules/apps-management/lib/request';
import httpClient from '@lib/http-client';

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
    url: `/api/v1/structor/${appID}/home/menu/user/list`,
    data: { appID },
  });
};

export const fetchFormScheme = (appID: string, tableID: string) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/${appID}/home/schema/${tableID}`,
  });
};

export const formDataCurd = (appID: string, tableID: string, data: any) => {
  return request({
    method: 'post',
    url: `/api/v1/structor/${appID}/home/form/${tableID}`,
    data,
  });
};

export const getPerOption = <T>(appID: string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/getPerOption`);
};

export const roleChange = <T>(appID: string, perGroupID:string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/saveUserPerMatch`, { perGroupID });
};
