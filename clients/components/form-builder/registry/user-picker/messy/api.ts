import httpClient, { httpClientGraphQL } from '@lib/http-client';
interface User {
  userName: string,
  id: string,
  email: string,
}
export interface Res {
  data: User[];
  total_count: number
}

export async function searchUser<T>(params: { query: string }) {
  return await httpClientGraphQL<T>('/api/v1/search/user', params);
}

export const getUserDetail = <T>(IDs: string[]) => {
  return httpClient<T>('/api/v1/org/h/user/ids', { IDs } );
};

