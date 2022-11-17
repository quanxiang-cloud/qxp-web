import httpClient, { httpClientGraphQL } from '@lib/http-client';
import { fetchOneFormDataWithSchema } from '@lib/http-client-form';
import toast from '@lib/toast';

export type SchemaAndRecord = {
  schema: ISchema;
  record?: Record<string, any>;
}

export function getSchemaAndRecord(
  appID: string, tableID: string, recordID: string,
): Promise<SchemaAndRecord> {
  return fetchOneFormDataWithSchema(appID, tableID, recordID).then(({ schemaRes, record }) => {
    if (!schemaRes) {
      return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
    }
    return { schema: schemaRes.schema, record };
  });
}

export const getOperate = (
  appID: string,
  data: {paths: { accessPath: string, method: string }[]},
): Promise<Record<string, boolean>> => {
  return httpClient<Record<string, boolean>>(`/api/v1/form/${appID}/home/apiPermit/list`, data)
    .then((res) => res || {})
    .catch((err) => {
      toast.error(err);
      return {};
    });
};

export const getApiPermit = (
  appID: string,
  data: { roleID: string, path: string, uri: string, method: string },
): any => {
  return httpClient(`/api/v1/form/${appID}/m/apiPermit/get`, data)
    .then((res) => res || {})
    .catch((err) => {
      toast.error(err);
      return {};
    });
};

export const getPolyapi = (
  appID: string,
  tableID: string,
  data: object,
): any => {
  return httpClient(`/api/v1/polyapi/raw/list/system/app/${appID}/raw/inner/form/${tableID}`, data)
    .then((res) => res || {})
    .catch((err) => {
      toast.error(err);
      return {};
    });
};

// 下级成员
export const getSubordinate = (
  params: { query: string },
): any => {
  return httpClientGraphQL('/api/v1/search/subordinate', params, {
    'User-Id': 1,
    'Tenant-Id': 1,
  } as any)
    .then((res) => res || {})
    .catch((err) => {
      // toast.error(err);
      return {};
    });
};
