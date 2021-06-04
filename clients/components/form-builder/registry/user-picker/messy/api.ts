// 

import httpClient from '@lib/http-client';

interface User {
    userName: string,
    id: string
}

export interface Res {
    data: User[];
    total_count: number
}

export const searchUser = (props?: any): Promise<Res|null> => httpClient('/api/v1/structor/616423a0-0d34-4091-90b9-55cb4671b0cd/home/org/userList', props)