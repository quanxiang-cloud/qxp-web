import httpClient, { httpClientGraphQL } from '@lib/http-client';

export const createRole = (appID: string, data: RoleCreate): Promise<{ id: string }> => {
  return httpClient(`/api/v1/form1/${appID}/m/apiRole/create`, data);
};

export const copyRole = (appID: string, data: {
  groupID?: string;
  name?: string;
  description?: string;
}): Promise<{ id: string }> => {
  return httpClient(`/api/v1/form/${appID}/m/permission/duplicatePer`, data);
};

export const fetchRoles = (appID: string): Promise<{ list: Roles[] }> => {
  return httpClient(`/api/v1/form1/${appID}/m/apiRole/find`);
};

export const deleteRole = (appID: string, roleID: string): Promise<void> => {
  return httpClient(`/api/v1/form1/${appID}/m/apiRole/delete/${roleID}`);
};

export const fetchRolePerson = (appID: string, roleID: string): Promise<{ list: DeptAndUser[] }> => {
  return httpClient(`/api/v1/form1/${appID}/m/apiRole/grant/list/${roleID}`);
};

export const updateRole = (appID: string, data: Roles): Promise<void> => {
  return httpClient(`/api/v1/form1/${appID}/m/apiRole/update`, data);
};

export const updatePerUser = (
  appID: string,
  roleID: string,
  data: { add: DeptAndUser[], removes: string[] },
): Promise<void> => {
  return httpClient(`/api/v1/form1/${appID}/m/apiRole/grant/assign/${roleID}`, data);
};

export const getUserDetail = <T>(params: { query: string }): Promise<T> => {
  return httpClientGraphQL<T>('/api/v1/search/users', params);
};

export type Property = {
  type: string,
  properties?: Record<string, Property>
}

export type APIAuth = {
  path?: string,
  params?: Record<string, Property> | null,
  response?: Record<string, Property> | null,
  // condition:
  roleID?: string,
  id?: string
}

export const createAPIAuth = async (appID: string, data: APIAuth): Promise<void> => {
  return await httpClient(`/api/v1/form1/${appID}/m/apiPermit/create`, data);
};

export const updateAPIAuth = async (
  authID: string,
  appID: string,
  data: APIAuth,
): Promise<PolyAPI.Service> => {
  return await httpClient(`/api/v1/form1/${appID}/m/apiPermit/update/${authID}`, data);
};

export const fetchAPIListAuth = async (
  appID: string,
  data: { roleID: string, path: string }[],
): Promise<{ list: APIAuth[] }> => {
  return await httpClient(`/api/v1/form1/${appID}/m/apiPermit/list`, data);
};

export const deleteAPIAuth = async (
  appID: string,
  data: { roleID: string, path: string },
): Promise<void> => {
  return await httpClient(`/api/v1/form1/${appID}/m/apiPermit/delete`, data);
};

