import httpClient from '@lib/http-client';

export type createdAppRes = {
  id: string;
  creatBy: string;
}

export const fetchAppList = async (data: any) => {
  return await httpClient('/api/v1/app-center/adminList', { page: 1, limit: 9999, ...data });
};

export const createdApp = async (data: AppInfo): Promise<createdAppRes> => {
  return await httpClient('/api/v1/app-center/add', data);
};

export const delApp = async (id: string) => {
  return await httpClient('/api/v1/app-center/del', { id });
};
