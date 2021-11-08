import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';
import { IRoleListItem } from './role-list-item';

export async function getRoles() {
  const { roles } = await httpClient('/api/v1/goalie/listRole');
  return roles as IRoleListItem[];
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
  } = await httpClient('/api/v1/goalie/listRoleFunc', { roleID: queryKey[1] });
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
  roleId: string;
  type?: RoleBindType;
  page?: number;
  limit?: number;
}

export async function getRoleAssociations({ queryKey }: QueryFunctionContext<[
  string, GetRoleAssociationParams
]>) {
  const data: any = await httpClient('/api/v1/goalie/listRoleOwner', queryKey[1]);
  return ({
    departments: data.owners.filter(({ type }: { type: number }) => type === RoleBindType.employee) || [],
    employees: data.owners.filter(({ type }: { type: number }) => type === RoleBindType.department) || [],
    departmentsOrEmployees: data?.owners || [],
    total: data.total || 0,
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
  return await httpClient('/api/v1/goalie/updateRoleOwner', arg);
}

// search for department structure
export const getDepartmentStructure = () => {
  return httpClient<Department>('/api/v1/org/DEPTree');
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
export async function adminSearchUserList({ queryKey }: QueryFunctionContext) {
  const data: {
    data: IUser[],
    total_count: number
  } = await httpClient('/api/v1/org/adminUserList',
    queryKey[1] as {
      depID: string;
      userName?: string;
    },
  );
  return { users: data.data, total: data.total_count };
}

export async function transferRoleSuper(id: string): Promise<{ code: number, msg: string }> {
  return await httpClient('/api/v1/goalie/transferRoleSuper', { transferee: id });
}
