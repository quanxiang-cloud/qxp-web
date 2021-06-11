import httpClient, { formDataRequest, getTableSchema } from '@lib/http-client';

export type SchemaAndRecord = {
  schema: ISchema;
  record?: Record<string, any>;
}

export async function findOneRecord(appID: string, tableID: string, _id?: string): Promise<{
  entities: any[]
}> {
  if (!_id) {
    return Promise.resolve({ entities: [] });
  }
  const entities = await formDataRequest(appID, tableID, {
    method: 'findOne',
    conditions: {
      condition: [{ key: '_id', op: 'eq', value: [_id] }],
    },
  });

  return { entities: entities ? [entities] : [] };
}

export function getSchemaAndRecord(
  appID: string, tableID: string, recordID?: string,
): Promise<SchemaAndRecord> {
  return Promise.all([
    getTableSchema(appID, tableID),
    findOneRecord(appID, tableID, recordID),
  ]).then(([{ schema }, { entities }]) => {
    if (!schema) {
      return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
    }

    return { schema, record: entities[0] };
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
