import httpClient from '@lib/http-client';

export async function userResetPassword({ old, new: newPassword }: Record<string, string>) {
  await httpClient<any>('/api/v1/warden/org/h/account/reset/password',
    {
      oldPassword: old,
      newPassword,
    },
  );
}
