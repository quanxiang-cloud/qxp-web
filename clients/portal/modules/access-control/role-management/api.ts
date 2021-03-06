import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';

import { IRoleListItem } from './role-list-item';
import { ROLE_BIND_TYPE } from './role-detail/associate-department-employee/department-or-employee-table';

export async function getRoles(params: {
  name?: string;
  page: number;
  limit: number
}) {
  const { data } = await httpClient.get('/api/v1/goalie/role/list', params);
  return data as IRoleListItem[];
}

// 获取角色功能集
export interface IRoleFuncItem {
  name: string;
  funcTag: string;
  has: boolean;
  id: string | number;
  child: IRoleFunc;
}
export interface IRoleFunc {
  [key: string]: IRoleFuncItem;
}
export async function getRoleFunctions({ queryKey }: QueryFunctionContext) {
  const data: {
    func: IRoleFunc;
    lastSaveTime: number;
  } = await httpClient.get('/api/v1/goalie/role/func/role/list', { roleID: queryKey[1] });
  return data;
}

// 设置用户功能集-暂未调用
export async function setRoleFunctions({ queryKey }: QueryFunctionContext) {
  return await httpClient('/api/v1/goalie/updateRoleFunc', {
    roleID: queryKey[1],
    add: queryKey[2],
    ...(queryKey[3] ? { delete: queryKey[3] } : {}),
  });
}

// 获取角色关联
interface GetRoleAssociationParams {
  roleID: string;
  type?: RoleBindType;
  page?: number;
  limit?: number;
}

export async function getRoleAssociations({ queryKey }: QueryFunctionContext<[
  string, GetRoleAssociationParams
]>) {
  const data: any = await httpClient.get('/api/v1/goalie/role/owner/list', queryKey[1] as any);
  return ({
    departments: data?.owners.filter(({ type }: { type: number }) => type === ROLE_BIND_TYPE.employee) || [],
    employees: data?.owners.filter(({ type }: { type: number }) => type === ROLE_BIND_TYPE.department) || [],
    departmentsOrEmployees: data?.owners || [],
    total: data?.total || 0,
  });
}

// 修改角色关联
export interface IUpdateRoleAssociations {
  roleID?: string;
  delete?: string[];
  add?: {
    type?: 1 | 2;
    ownerID?: string;
  }[];
}

export async function updateRoleAssociations(arg: IUpdateRoleAssociations) {
  return await httpClient('/api/v1/goalie/role/update/owner', arg);
}

// search for department structure
export const getDepartmentStructure = () => {
  return httpClient.get<Department>('/api/v1/org/m/dep/tree');
};

interface IUserDepartment extends Department {
  createTime: number;
  updateTime: number;
  grade: number;
}
export interface IUser {
  createBy: string;
  createTime: number;
  dep: IUserDepartment;
  email: string;
  id: string;
  phone: string;
  updateTime: number;
  useStatus: number;
  userIconURL: string;
  userName: string;
}

export async function transferRoleSuper(id: string): Promise<{ code: number, msg: string }> {
  return await httpClient('/api/v1/goalie/role/transferRoleSuper', { transferee: id });
}
