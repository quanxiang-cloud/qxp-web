import httpClient from '@lib/http-client';

export type CreatedAppRes = {
  id: string;
  creatBy: string;
}

type CreateTaskRes = {
  taskID: string;
}

export const fetchAppList = async (data: any): Promise<unknown> => {
  return await httpClient('/api/v1/app-center/adminList', { page: 1, limit: 9999, ...data });
};

export const createdApp = async (data: AppInfo): Promise<CreatedAppRes> => {
  return await httpClient('/api/v1/app-center/add', data);
};

export const createDummyApp = async (data: AppInfo): Promise<CreatedAppRes> => {
  return await httpClient('/api/v1/app-center/importApp', data);
};

export const createImportAppTask = async (data: AppZipInfo): Promise<CreateTaskRes> => {
  return await httpClient('/api/v1/entrepot/task/create/appImport', data);
};

export const exportAppAndCreateTask = (data: Partial<AppZipInfo>): Promise<CreateTaskRes> => {
  return httpClient('/api/v1/entrepot/task/create/appExport', data);
};

export const delApp = async (id: string): Promise<unknown> => {
  return await httpClient('/api/v1/app-center/del', { id });
};

export const createAppByTemplateTask = async (
  title: string,
  value: { templateID: string; appID: string; },
): Promise<any> => {
  return await httpClient('/api/v1/entrepot/task/create/useTemplate', { value, title });
};
