import httpClient from '@lib/http-client';
export interface Organization {
  name: string,
  id: string;
  pid: string;
  child?: Organization[];
  fullPath?: string;
}

export async function getERPTree() {
  return await httpClient.get<Organization>('/api/v1/org/m/dep/tree');
}

export const getOrganizationDetail = <T>(IDs: string[]) => {
  return httpClient<T>('/api/v1/org/h/dep/ids', { IDs });
};
