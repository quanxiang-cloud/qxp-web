import { QueryFunctionContext } from 'react-query';

import { httpPost, getNestedPropertyToArray } from '@assets/lib/utils';
import { IResponse } from '@clients/@types/interface/api';
import { IDepartment } from '@clients/common/state/portal';

// get user info
export interface IUserInfo {
  id: string;
  userName: string;
  phone: string;
  email: string;
  userIconURL?: string;
  dep?: IDepartment;
  depIds?: string[];
  authority?: string[];
  roleId?: string;
  deleteId?: string;
}
export const getUserInfo = async (): Promise<Partial<IUserInfo>> => {
  const { data } = await httpPost<IResponse<IUserInfo>>('/api/org/v1/userUserInfo');
  if (data) {
    data.depIds = getNestedPropertyToArray<string>(data?.dep, 'id', 'child');
  }
  return data || {};
};

// get all user funcs
export const getUserFuncs = async ({ queryKey }: QueryFunctionContext): Promise<string[]> => {
  const { data } = await httpPost<
    IResponse<{
      tag: string[];
    }>
  >(
    '/api/goalie/listUserFuncTag',
    JSON.stringify({
      departmentID: queryKey[1],
    }),
  );
  return data?.tag || [];
};

// get system func list
export const getSystemFuncs = async (): Promise<string[]> => {
  const { data } = await httpPost<
    IResponse<{
      tag: string[];
    }>
  >('/api/goalie/listFuncTag', JSON.stringify({}));
  return data?.tag || [];
};

export interface IRole {
  id: string;
  name: string;
  tag: string;
  roleID: string;
}
export const getUserRoles = async (
  userId: string,
  departmentIDs: string[],
): Promise<{ roles: IRole[]; total: number }> => {
  const { data } = await httpPost<
    IResponse<{
      roles: IRole[];
      total: number;
    }>
  >(
    '/api/goalie/listUserRole',
    JSON.stringify({
      departmentID: departmentIDs,
    }),
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Id': userId,
    },
  );
  return data || { roles: [], total: 0 };
};
