import httpClient from '@lib/http-client';

export type TemplateListRes = {
  count: number;
  templates: any;
}

export async function fetchTemplateList(): Promise<TemplateListRes> {
  return await httpClient('/api/v1/app-center/template/selfList');
}

export async function deleteTemplate(id: string): Promise<any> {
  return await httpClient('/api/v1/app-center/template/delete', { id });
}
