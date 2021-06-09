import httpClient from '@lib/http-client';

// todo delete this
// get all user funcs
export async function getUserFuncs(): Promise<string[]> {
  return window.ADMIN_USER_FUNC_TAGS;
}

// get system func list
export async function getSystemFuncs(): Promise<string[]> {
  const data: { tag: string[] } = await httpClient('/api/v1/goalie/listFuncTag', {});
  return data.tag || [];
}

export async function getUserAdminRoles(): Promise<{ roles: Role[]; total: number }> {
  return { roles: window.USER_ADMIN_ROLES, total: window.USER_ADMIN_ROLES.length };
}

export async function userResetPassword({ old, new: newPassword }: Record<string, string>) {
  await httpClient<any>('/api/v1/nurturing/userResetPWD',
    {
      oldPassword: old,
      newPassword,
    },
  );
}
