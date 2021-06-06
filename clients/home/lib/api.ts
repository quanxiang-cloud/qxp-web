import httpClient from '@lib/http-client';

export const fetchUserList = ()=> {
  return httpClient('/api/v1/app-center/userList', { page: 1, limit: 9999 });
};

export const fetchPageList = (appID: string)=> {
  return httpClient(`/api/v1/structor/${appID}/home/menu/user/list`, { appID });
};

// todo refactor
type GetTableSchemaResponse = { config: any; id: string; schema?: ISchema; tableID: string; };

export const fetchFormScheme = (appID: string, tableID: string) => {
  return httpClient<GetTableSchemaResponse>(
    `/api/v1/structor/${appID}/home/schema/${tableID}`,
    { tableID },
    { 'X-Proxy': 'FORM_SCHEMA' },
  );
};

export const getPerOption = <T>(appID: string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/getPerOption`);
};

export const roleChange = <T>(appID: string, perGroupID:string) => {
  return httpClient<T>(`/api/v1/structor/${appID}/home/permission/perGroup/saveUserPerMatch`, { perGroupID });
};
