import { QueryFunctionContext } from 'react-query';

import { httpPost } from '@lib/utils';

// get all user funcs
export const getUserFuncs = async ({ queryKey }: QueryFunctionContext): Promise<string[]> => {
  const { data } = await httpPost<
    {
      tag: string[];
    }
  >(
    '/api/v1/goalie/listUserFuncTag',
    JSON.stringify({
      departmentID: queryKey[1],
    }),
  );
  return data?.tag || [];
};

// get system func list
export const getSystemFuncs = async (): Promise<string[]> => {
  const { data } = await httpPost<
    {
      tag: string[];
    }
  >('/api/v1/goalie/listFuncTag', JSON.stringify({}));
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
    {
      roles: IRole[];
      total: number;
    }
  >(
    '/api/v1/goalie/listUserRole',
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

export async function userResetPassword({
  old, new: newPassword,
}: Record<string, string>) {
  await httpPost<any>(
    '/api/v1/nurturing/userResetPWD',
    JSON.stringify({
      oldPassword: old,
      newPassword,
    })
  );
}
