import httpClient from '@lib/http-client';

export const fetchUserList = async ()=> {
  return await httpClient('/api/v1/app-center/userList', { page: 1, limit: 9999 });
};

export const fetchPageList = async (appID: string)=> {
  return await httpClient(`/api/v1/structor/${appID}/home/menu/user/list`, { appID });
};

export const fetchFormScheme = async (appID: string, tableID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/home/schema/${tableID}`);
};

export const formDataCurd = async (appID: string, tableID: string, data: any)=> {
  return await httpClient(`/api/v1/structor/${appID}/home/form/${tableID}`, data );
};

export const getPerOption = <T>(appID: string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/getPerOption`);
};

export const roleChange = <T>(appID: string, perGroupID:string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/saveUserPerMatch`, { perGroupID });
};
