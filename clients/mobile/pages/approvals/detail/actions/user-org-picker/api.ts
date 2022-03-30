import httpClient from '@lib/http-client';

export function getAdminOrg(): Promise<Department> {
  return httpClient('/api/v1/org/m/dep/tree');
}

export function getUserList(
  depID: string, limit: number, page: number, userName?: string,
): Promise<UserApi.AdminUserResponse> {
  const params = { depID, limit, page, userName };
  return httpClient('/api/v1/org/h/dep/ids', params);
}

