import httpClient from '@lib/http-client';

export const fetchUserList = () => {
  return httpClient('/api/v1/app-center/userList', { page: 1, limit: 9999 });
};

export const fetchPageList = (appID: string) => {
  return httpClient('/api/v1/structor/menu/list', { appID });
};

export const fetchFormScheme = (tableID: string) => {
  return httpClient('/api/v1/structor/table/getByID', { tableID });
};
