import httpClient from '@lib/http-client';
import { httpPost } from '@lib/utils';

// todo delete this
// get all user funcs
export const getUserFuncs = async (): Promise<string[]> => {
  return window.USER_FUNC_TAGS;
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

export const getUserRoles = async (): Promise<{ roles: Role[]; total: number }> => {
  return { roles: window.USER_ROLES, total: window.USER_ROLES.length };
};

export async function userResetPassword({ old, new: newPassword }: Record<string, string>) {
  await httpClient<any>('/api/v1/nurturing/userResetPWD',
    {
      oldPassword: old,
      newPassword,
    }
  );
}
