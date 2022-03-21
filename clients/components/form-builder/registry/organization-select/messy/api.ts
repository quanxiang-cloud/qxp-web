import httpClient, { httpClientGraphQL } from '@lib/http-client';
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

export const getOrganizationDetail = <T>(params: { query: string }) => {
  return httpClientGraphQL<T>('/api/v1/nurturing/getDepIDs', params);
};
