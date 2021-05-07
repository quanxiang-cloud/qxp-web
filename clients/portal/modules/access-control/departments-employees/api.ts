import { httpFile } from '@lib/utils';
import httpClient from '@lib/http-client';

import { FormValues } from './modal/edit-employees-modal';
import { UserStatus } from './type';

export async function getERPTree() {
  return await httpClient<Department>('/api/v1/org/DEPTree');
}

export async function createDepartment(params: { pid: string; departmentName: string; }) {
  return await httpClient('/api/v1/org/addDEP', params);
}

export async function editDepartment(params: {
  pid: string;
  departmentName?: string;
  departmentLeaderID?: string;
}) {
  return await httpClient('/api/v1/org/updateDEP', params);
}

export async function getAdminDEPSuperPID() {
  return await httpClient('/api/v1/org/adminDEPSuperPID');
}

export async function deleteDEP(id: string) {
  return await httpClient('/api/v1/org/delDEP', { id });
}

export async function getUserAdminInfo(depID: string, params: any) {
  const data: {
    total_count: number;
    data: Employee[]
  } = await httpClient('/api/v1/org/adminUserList', { depID, ...params });
  return {
    total: data.total_count || 0,
    data: data.data || [],
  };
}

export async function getUserTemplate() {
  return await httpClient<{ fileURL: string }>('/api/v1/org/getUserTemplate');
}

export async function importTempFile({ depID, file }: FileParams) {
  return await httpFile('/api/v1/org/importFile', { depID, file });
}

export async function addDepUser(values: FormValues) {
  return await httpClient('/api/v1/nurturing/addUser', values);
}

export async function updateUser(values: FormValues) {
  return await httpClient('/api/v1/nurturing/updateUser', values);
}

export interface LeaderParams {
  depID: string;
  userID?: string;
}

export async function setDEPLeader({ depID, userID }: LeaderParams) {
  return await httpClient('/api/v1/org/setDEPLeader', { depID, userID });
}

export async function cancelDEPLeader({ depID }: LeaderParams) {
  return await httpClient('/api/v1/org/cancelDEPLeader', { depID });
}

export async function updateUserStatus({ id, status }: {
  id: string;
  status: UserStatus;
}) {
  return await httpClient('/api/v1/nurturing/updateUserStatus', { id, useStatus: status });
}

export async function batchAdjustDep({ usersID, oldDepID, newDepID }: {
  usersID: string[];
  oldDepID: string;
  newDepID: string;
}) {
  return httpClient('/api/v1/org/adminChangeUsersDEP', { usersID, oldDepID, newDepID });
}

export async function resetUserPWD({ userIDs, sendEmail, sendPhone }: {
  userIDs: string[];
  sendEmail: -1 | 1;
  sendPhone: -1 | 1;
}) {
  return await httpClient( '/api/v1/nurturing/adminResetPWD', { userIDs, sendEmail, sendPhone });
}

export type FileParams = {
  depID: string;
  file: File;
};
