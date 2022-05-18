import httpClient from '@lib/http-client';

import { SubmitParams, TableParams } from './type';

export async function addColumn(params: SubmitParams): Promise<void> {
  return await httpClient('/api/v1/org/m/column/add', params);
}

export async function updateColumn(id: string, params: SubmitParams): Promise<void> {
  return await httpClient.put('/api/v1/org/m/column/update/name', { ...params, id });
}

export async function deleColumn(id: string): Promise<void> {
  return await httpClient.delete('/api/v1/org/m/column/del', { id });
}

export async function getColumn(name?: string): Promise<{ all: Array<TableParams>}> {
  return await httpClient.get('/api/v1/org/m/column/all', { name });
}

export async function setColumn(add: Array<string>, ids: Array<string>): Promise<void> {
  return await httpClient.put('/api/v1/org/m/column/set', {
    add, delete: ids, roleID: window.USER_ADMIN_ROLES[0].roleID,
  });
}

export async function openExtend(): Promise<void> {
  return await httpClient('/api/v1/org/m/column/open');
}
