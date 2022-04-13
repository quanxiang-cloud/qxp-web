import httpClient from '@lib/http-client';

export function fetchUserList() {
  return httpClient('/api/v1/app-center/userList', { page: 1, limit: 9999 });
}

export function getPerOption<T>(appID: string) {
  return httpClient<T>(`/api/v1/form/${appID}/home/apiRole/list`);
}

export function roleChange<T>(appID: string, roleID: string) {
  return httpClient<T>(`/api/v1/form/${appID}/home/apiRole/create`, { roleID });
}

