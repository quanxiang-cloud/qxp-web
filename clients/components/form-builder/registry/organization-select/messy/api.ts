// 

import httpClient from '@lib/http-client';

export interface Organization {
    departmentName: string,
    id: string
    child?: Organization[]
}

export const searchOrganziation = (props?: any): Promise<Organization> => httpClient('/api/v1/structor/616423a0-0d34-4091-90b9-55cb4671b0cd/home/org/DEPTree', props)