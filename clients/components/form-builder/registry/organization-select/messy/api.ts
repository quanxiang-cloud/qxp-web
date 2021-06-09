import httpClient from '@lib/http-client';
export interface Organization {
    departmentName: string,
    id: string
    child?: Organization[]
}

export const searchOrganziation = (appID: string, props?: any): Promise<Organization> => httpClient(`/api/v1/structor/${appID}/home/org/DEPTree`, props);
