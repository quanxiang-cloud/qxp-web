import httpClient from '@lib/http-client';

export const fetchUserList = ()=> {
  return httpClient('/api/v1/app-center/userList', { page: 1, limit: 9999 });
};

export const getPerOption = <T>(appID: string) => {
  return httpClient<T>(`/api/v1/form/${appID}/home/apiRole/list`);
};

export const roleChange = <T>(appID: string, roleID: string) => {
  return httpClient<T>(`/api/v1/form/${appID}/home/apiRole/create`, { roleID });
};

