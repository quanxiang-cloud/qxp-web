import httpClient, { fetchOneFormDataWithSchema } from '@lib/http-client';

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

export const fetchPageList = (appID: string) => {
  return httpClient(`/api/v1/structor/${appID}/home/menu/list`, { appID });
};

export const getOperate = <T>(appID: string, formID: string) => {
  return httpClient<T>(
    `/api/v1/structor/${appID}/home/permission/operatePer/getOperate`,
    { formID },
  );
};
