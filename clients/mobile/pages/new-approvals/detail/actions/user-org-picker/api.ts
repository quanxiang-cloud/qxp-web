import httpClient, { httpClientGraphQL } from '@lib/http-client';

export function getAdminOrg(): Promise<Department> {
  return httpClient.get('/api/v1/org/m/dep/tree');
}

export function getUserList(
  depID: string, limit: number, page: number, userName?: string,
): Promise<UserApi.AdminUserResponse> {
  const params = { depID, limit, page, userName };
  return httpClient('/api/v1/org/m/user/list', params);
}

export async function searchUser(params: { query: string }): Promise<UserApi.SearchUserResponse> {
  return await httpClientGraphQL('/api/v1/search/user', params);
}
