import httpClient, { httpClientGraphQL } from '@lib/http-client';
export interface Organization {
    departmentName: string,
    id: string;
    pid: string;
    child?: Organization[];
    fullPath?: string;
}

export const searchOrganization = (appID: string, props?: any): Promise<Organization> => httpClient(`/api/v1/structor/${appID}/home/org/DEPTree`, props);

export const getOrganizationDetail = <T>(params: { query: string }) => {
  return httpClientGraphQL<T>('/api/v1/nurturing/getDepIDs', params);
};
