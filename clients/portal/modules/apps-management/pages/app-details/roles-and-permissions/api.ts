import httpClient, { httpClientGraphQL } from '@lib/http-client';
import {
  QueryRequestNodeApiListInputBody,
  QueryRequestNodeApiListResponse,
} from '@portal/modules/poly-api/effects/api/raw';

export function createRole(appID: string, data: RoleCreate): Promise<{ id: string }> {
  return httpClient(`/api/v1/form/${appID}/m/apiRole/create`, data);
}

export function copyRole(appID: string, data: {
  groupID?: string;
  name?: string;
  description?: string;
}): Promise<{ id: string }> {
  return httpClient(`/api/v1/form/${appID}/m/permission/duplicatePer`, data);
}

export function fetchRoles(appID: string): Promise<RoleRight[]> {
  return httpClient<{ list: RoleRight[] }>(`/api/v1/form/${appID}/m/apiRole/find`, {})
    .then((res) => {
      return res?.list || [];
    }).catch(() => {
      return [];
    });
}

export function deleteRole(appID: string, roleID: string): Promise<void> {
  return httpClient(`/api/v1/form/${appID}/m/apiRole/delete/${roleID}`);
}

export function fetchRolePerson(
  appID: string,
  roleID: string,
  data: { type: number },
): Promise<{ list: DeptAndUser[], total: number }> {
  return httpClient<{ list: DeptAndUser[], total: number }>(
    `/api/v1/form/${appID}/m/apiRole/grant/list/${roleID}`, data,
  ).then((res) => {
    return { list: res.list || [], total: res.total || 0 };
  }).catch(() => {
    return { list: [], total: 0 };
  });
}

export function updateRole(appID: string, data: RoleRight): Promise<void> {
  return httpClient(`/api/v1/form/${appID}/m/apiRole/update`, data);
}

export function updatePerUser(
  appID: string,
  roleID: string,
  data: { add: DeptAndUser[], removes: string[] },
): Promise<void> {
  return httpClient(`/api/v1/form/${appID}/m/apiRole/grant/assign/${roleID}`, data);
}

export function getUserDetail<T>(params: { query: string }): Promise<T> {
  return httpClientGraphQL<T>('/api/v1/search/users', params);
}

export function getDepDetail<T>(params: { query: string }): Promise<T> {
  return httpClientGraphQL<T>('/api/v1/search/department', params);
}

export async function createAPIAuth(appID: string, data: APIAuth): Promise<void> {
  return await httpClient(`/api/v1/form/${appID}/m/apiPermit/create`, data);
}

export async function updateAPIAuth(
  authID: string,
  appID: string,
  data: APIAuth,
): Promise<PolyAPI.Service> {
  return await httpClient(`/api/v1/form/${appID}/m/apiPermit/update/${authID}`, data);
}

export async function fetchAPIListAuth(
  appID: string,
  data: {
    roleID: string,
    paths: string[],
    uris: string[],
  },
): Promise<Record<string, APIAuth>> {
  return await httpClient(`/api/v1/form/${appID}/m/apiPermit/list`, data);
}

export async function deleteAPIAuth(
  appID: string,
  data: { roleID: string, path: string, uri: string },
): Promise<void> {
  return await httpClient(`/api/v1/form/${appID}/m/apiPermit/delete`, data);
}

export function fetchGroupApiList(
  path: string,
  data: QueryRequestNodeApiListInputBody,
): Promise<QueryRequestNodeApiListResponse> {
  return httpClient(`/api/v1/polyapi/${path.split('/')[3]}/list/${path}`, data);
}

export function fetchApiAuthDetails(
  appID: string,
  data: {roleID: string, path: string, uri: string},
): Promise<APIAuth> {
  return httpClient(`/api/v1/form/${appID}/m/apiPermit/get`, data);
}
