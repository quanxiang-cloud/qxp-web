import httpClient, { formDataRequest, getTableSchema } from '@lib/http-client';

type SchemaAndRecord = {
  schema: ISchema;
  record?: Record<string, any>;
}

export async function findOneRecord(appID: string, tableID: string, _id?: string): Promise<any> {
  if (!_id) {
    return Promise.resolve({ entities: [] });
  }
  const data = await formDataRequest(appID, tableID, {
    method: 'findOne',
    conditions: {
      condition: [{ key: '_id', op: 'eq', value: [_id] }],
    },
  });

  return data?.entity;
}

export async function getSchemaAndRecord(
  appID: string, tableID: string, recordID?: string,
): Promise<SchemaAndRecord> {
  const [{ schema }, record] = await Promise.all([
    getTableSchema(appID, tableID),
    findOneRecord(appID, tableID, recordID),
  ]);
  if (!schema) {
    return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
  }
  return { schema, record };
}

export const fetchPageList = (appID: string): Promise<unknown> => {
  return httpClient(`/api/v1/structor/${appID}/home/menu/user/list`, { appID });
};

// todo refactor
type GetTableSchemaResponse = { config: any; id: string; schema?: ISchema; tableID: string; };

export const fetchFormScheme = (appID: string, tableID: string): Promise<GetTableSchemaResponse> => {
  return httpClient<GetTableSchemaResponse>(
    `/api/v1/structor/${appID}/home/schema/${tableID}`,
    { tableID },
  );
};

export const formDataCurd = (appID: string, tableID: string, data: any): Promise<unknown> => {
  return httpClient(`/api/v1/structor/${appID}/home/form/${tableID}`, data);
};

export const getOperate = <T>(appID: string, formID: string): Promise<T> => {
  return httpClient<T>(
    `/api/v1/structor/${appID}/home/permission/operatePer/getOperate`,
    { formID },
  );
};
