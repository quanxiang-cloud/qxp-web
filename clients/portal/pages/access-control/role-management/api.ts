import { QueryFunctionContext } from 'react-query';

import { httpPost, mapTreeData } from '../../../../assets/lib/utils';
import { IResponse } from '../../../../@types/interface/api';
import Role from './role';
import { ITreeData } from '@portal/components/qxp-tree';

// 获取角色列表
export const getRolesList = () =>
  httpPost<IResponse<{ roles: Role[] }>>('/api/goalie/listRole', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then(({ data }) => data?.roles);

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
    IResponse<{
      func: IRoleFunc;
      lastSaveTime: number;
    }>
  >(
    '/api/goalie/listRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
    }),
  ).then(({ data }) => ({ func: data?.func, lastSaveTime: data?.lastSaveTime }));

// 设置用户功能集
export const setRoleFunctions = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    IResponse<{
      code: number;
    }>
  >(
    '/api/goalie/updateRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
      add: queryKey[2],
      ...(queryKey[3] ? { delete: queryKey[3] } : {}),
    }),
  ).then(({ data, code }) => ({ code, data }));

export interface IOwner {
  type: number;
  ownerID: string;
  ownerName?: string;
  phone: string;
  email: string;
  departmentName?: string;
  createdAt: number;
  id: string;
}

// 获取角色关联
export const getRoleAssociations = ({
  queryKey,
}: QueryFunctionContext<
  [
    string,
    {
      roleId: string;
      type?: string;
      page?: string;
      limit?: string;
    },
  ]
>) =>
  httpPost<
    IResponse<{
      owners: IOwner[];
      total: number;
    }>
  >('/api/goalie/listRoleOwner', JSON.stringify(queryKey[1])).then(({ data }) => ({
    owners: data?.owners || [],
    total: data?.total || 0,
  }));

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
    IResponse<{
      roles: Role[];
    }>
  >('/api/goalie/updateRoleOwner', JSON.stringify(arg)).then(({ data }) => {
    roles: data?.roles || [];
  });

// search for department structure
export const getDepartmentStructure = async () => {
  const { data } = await httpPost<IResponse<IDepartment>>('/api/org/v1/DEPTree', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  return data;
};

interface IUserDepartment extends IDepartment {
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
    IResponse<{
      // eslint-disable-next-line camelcase
      total_count: number;
      data: IUser[];
    }>
  >(
    '/api/org/v1/adminUserList',
    JSON.stringify(
      queryKey[1] as {
        depID: string;
        userName?: string;
      },
    ),
  );
  return { users: data?.data, total: data?.total_count };
};
