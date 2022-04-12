import httpClient from '@lib/http-client';

export type TemplateListRes = {
  count: number;
  templates: any;
}

export const saveAppAsTemplate = async (value: Omit<TemplateInfo, 'id'>, title: string): Promise<void> => {
  return await httpClient('/api/v1/entrepot/task/create/createTemplate', { value, title });
};

export async function fetchTemplateList(): Promise<TemplateListRes> {
  return await httpClient('/api/v1/app-center/template/selfList', {});
}

export async function deleteTemplate(id: string): Promise<any> {
  return await httpClient('/api/v1/app-center/template/delete', { id });
}

export async function validateTemplateName(name: string): Promise<any> {
  return await httpClient('/api/v1/app-center/template/checkNameRepeat', { name });
}

export async function editTemplateInfo(id: string, name: string, appIcon: string): Promise<any> {
  return await httpClient('/api/v1/app-center/template/update', { id, name, appIcon });
}
