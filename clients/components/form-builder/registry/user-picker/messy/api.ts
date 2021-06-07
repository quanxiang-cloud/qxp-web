import httpClient from '@lib/http-client';
interface User {
    userName: string,
    id: string
}
export interface Res {
    data: User[];
    total_count: number
}

export const searchUser = (appID: string, props?: any): Promise<Res | null> => httpClient(`/api/v1/structor/${appID}/home/org/userList`, props);
