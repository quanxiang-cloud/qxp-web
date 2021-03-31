import { QueryFunctionContext } from 'react-query';

import { httpPost } from '@lib/utils';

import Role from '../pages/access-control/role-management/role';

// 获取角色列表
export async function getRoles() {
  const { data } = await httpPost<{ roles: Role[]; }>('/api/v1/goalie/listRole', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  return data?.roles;
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
export const getRoleFunctions = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    {
      func: IRoleFunc;
      lastSaveTime: number;
    }
  >(
    '/api/v1/goalie/listRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
    }),
  ).then(({ data }) => ({ func: data?.func, lastSaveTime: data?.lastSaveTime }));

// 设置用户功能集
export const setRoleFunctions = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    {
      code: number;
    }
  >(
    '/api/v1/goalie/updateRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
      add: queryKey[2],
      ...(queryKey[3] ? { delete: queryKey[3] } : {}),
    }),
  ).then(({ data, code }) => ({ code, data }));


// 获取角色关联
interface GetRoleAssociationParams {
  roleId: string;
  type?: string;
  page?: string;
  limit?: string;
}
export async function getRoleAssociations({ queryKey }: QueryFunctionContext<[
  string, GetRoleAssociationParams
]>) {
  const { data } = await httpPost<
    {
      owners: EmployeeOrDepartmentOfRole[];
      total: number;
    }
  >('/api/v1/goalie/listRoleOwner', JSON.stringify(queryKey[1]));
  return ({
    departments: data?.owners.filter(({ type }) => type === 2) || [],
    employees: data?.owners.filter(({ type }) => type === 1) || [],
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
export const updateRoleAssociations = (arg: IUpdateRoleAssociations) =>
  httpPost<
    {
      roles: Role[];
    }
  >('/api/v1/goalie/updateRoleOwner', JSON.stringify(arg)).then(({ data }) => {
    roles: data?.roles || [];
  });

// search for department structure
export const getDepartmentStructure = async () => {
  const { data } = await httpPost<Department>('/api/v1/org/DEPTree', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  return data;
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
export const adminSearchUserList = async ({ queryKey }: QueryFunctionContext) => {
  const { data } = await httpPost<
    {
      // eslint-disable-next-line camelcase
      total_count: number;
      data: IUser[];
    }
  >(
    '/api/v1/org/adminUserList',
    JSON.stringify(
      queryKey[1] as {
        depID: string;
        userName?: string;
      },
    ),
  );
  return { users: data?.data, total: data?.total_count };
};
