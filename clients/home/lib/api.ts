import httpClient from '@lib/http-client';

export const fetchUserList = ()=> {
  return httpClient('/api/v1/app-center/userList', { page: 1, limit: 9999 });
};

export const getPerOption = <T>(appID: string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/getPerOption`);
};

export const roleChange = <T>(appID: string, perGroupID: string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/saveUserPerMatch`, { perGroupID });
};
