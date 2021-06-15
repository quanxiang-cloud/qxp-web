import httpClient, { getTableSchema } from '@lib/http-client';

export type SchemaAndRecord = {
  schema: ISchema;
  record?: Record<string, any>;
}

export function findOneRecord(appID: string, tableID: string, id: string): Promise<Record<string, any>> {
  if (!id) {
    return Promise.resolve({});
  }
  return httpClient<{ entity?: Record<string, any>; }>(
    `/api/v1/structor/${appID}/home/form/${tableID}`,
    {
      method: 'findOne',
      conditions: {
        condition: [{ key: '_id', op: 'eq', value: [id] }],
      },
    },
    { 'X-Proxy': 'FORM_DATA' },
  ).then(({ entity }) => {
    if (!entity) {
      // 只查 schema 的时候不要 reject
      return {};
    }

    return entity;
  });
}

export function getSchemaAndRecord(
  appID: string, tableID: string, recordID: string,
): Promise<SchemaAndRecord> {
  return Promise.all([
    getTableSchema(appID, tableID),
    findOneRecord(appID, tableID, recordID),
  ]).then(([{ schema }, record]) => {
    if (!schema) {
      return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
    }

    return { schema, record };
  });
}

export const fetchPageList = (appID: string) => {
  return httpClient(`/api/v1/structor/${appID}/home/menu/user/list`, { appID });
};

// todo refactor
type GetTableSchemaResponse = { config: any; id: string; schema?: ISchema; tableID: string; };

export const fetchFormScheme = (appID: string, tableID: string) => {
  return httpClient<GetTableSchemaResponse>(
    `/api/v1/structor/${appID}/home/schema/${tableID}`,
    { tableID },
  );
};

export const formDataCurd = (appID: string, tableID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/home/form/${tableID}`, data);
};

export const getOperate = <T>(appID: string, formID: string) => {
  return httpClient<T>(
    `/api/v1/structor/${appID}/home/permission/operatePer/getOperate`,
    { formID },
  );
};
