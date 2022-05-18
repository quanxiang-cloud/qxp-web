import { httpFile } from '@lib/utils';
import httpClient, { httpClientGraphQL } from '@lib/http-client';

import { FormValues } from './modal/edit-employees-modal';
import { UserStatus } from './type';
import { SendMessage } from './modal/reset-password-modal';

export async function getERPTree() {
  return await httpClient.get<Department>('/api/v1/org/m/dep/tree');
}

export async function createDepartment(params: { pid: string; name: string; attr: number}) {
  return await httpClient('/api/v1/org/m/dep/add', params);
}

export async function editDepartment(params: {
  id: string;
  attr: string | number;
  pid?: string;
  name?: string
  leaderID?: string;
  useStatus?: number;
}) {
  return await httpClient.put('/api/v1/org/m/dep/update', params);
}

export async function getAdminDEPSuperPID() {
  return await httpClient('/api/v1/org/adminDEPSuperPID');
}

export async function deleteDEP(id: string) {
  return await httpClient('/api/v1/org/m/oth/dep/del', { id });
}

export async function getUserAdminInfo<T>(params: { query: string }) {
  return await httpClientGraphQL<T>('/api/v1/search/user', params);
}

export function getDepartmentInfo<T>(params: { query: string }): Promise<T> {
  return httpClientGraphQL<T>('/api/v1/search/department', params);
}

export type EmployeeColumnInfo = {
  id: string,
  attr: number,
  columnName: string,
  name: string,
  status: number,
}
export async function fetchEmployeeColumn(): Promise<{ all: EmployeeColumnInfo[] }> {
  return await httpClient.get('/api/v1/org/m/column/all');
}

export async function getUserTemplate() {
  return await httpClient.get<{ fileURL: string }>('/api/v1/org/m/user/template');
}

export async function importTempFile({ depID, file }: FileParams) {
  return await httpFile('/api/v1/org/importFile', { depID, file });
}

export async function addDepUser(values: FormValues) {
  return await httpClient('/api/v1/org/m/user/add', values);
}

export async function updateUser(values: FormValues) {
  return await httpClient.put('/api/v1/org/m/user/update', values);
}

export type LeaderParams = {
  depID: string;
  userID?: string;
  attr?: string;
}

export async function setDEPLeader(params: LeaderParams) {
  return await httpClient.put('/api/v1/org/m/dep/set/leader', params);
}

export async function cancelDEPLeader(params: LeaderParams) {
  return await httpClient.put('/api/v1/org/m/dep/cancel/leader', params);
}

export async function updateUserStatus({ id, status }: {
  id: string;
  status: UserStatus;
}) {
  return await httpClient('/api/v1/warden/org/m/user/update/status', { id, useStatus: status });
}

export async function batchAdjustDep({ usersID, oldDepID, newDepID }: {
  usersID: string[];
  oldDepID: string;
  newDepID: string;
}) {
  return httpClient.put('/api/v1/org/m/user/change/dep', { usersID, oldDepID, newDepID });
}

export async function resetUserPWD({ userIDs, sendMessage }: {
  userIDs: string[];
  sendMessage: SendMessage[]
}) {
  return await httpClient('/api/v1/warden/org/m/account/reset/password', { userIDs, sendMessage });
}

export type FileParams = {
  depID: string;
  file: File;
};
