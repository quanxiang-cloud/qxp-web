import httpClient from '@lib/http-client';

type TemplateListRes = {
  count: number;
  templates: any;
}
export function fetchTemplateList(): Promise<TemplateListRes> {
  return httpClient(
    '/api/v1/app-center/template/selfList',
  );
}
