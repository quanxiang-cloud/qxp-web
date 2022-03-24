import httpClient from '@lib/http-client';

export function getAdminOrg(): Promise<Department> {
  return httpClient('/api/v1/org/DEPTree');
}

export function getUserList(
  depID: string, limit: number, page: number, userName?: string,
): Promise<UserApi.AdminUserResponse> {
  const params = { depID, limit, page, userName };
  return httpClient('/api/v1/org/adminUserList', params);
}

