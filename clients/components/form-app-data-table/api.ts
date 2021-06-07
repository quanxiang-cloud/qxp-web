import httpClient, { formDataRequest, getTableSchema } from '@lib/http-client';

export const formDataCurd = (appID: string, tableID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/home/form/${tableID}`, data, {
    'X-Proxy': 'FORM_DATA',
  });
};

type SchemaAndRecord = {
  schema: ISchema;
  record: Record<string, any>;
}

export function getSchemaAndRecord(
  appID: string, tableID: string, recordID: string
): Promise<SchemaAndRecord> {
  return Promise.all([
    getTableSchema(appID, tableID),
    formDataRequest(appID, tableID, {
      method: 'findOne',
      conditions: {
        condition: [{ key: '_id', op: 'eq', value: [recordID] }],
      },
    }),
  ]).then(([{ schema }, { entities }]) => {
    if (!schema) {
      return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
    }

    if (!entities.length) {
      return Promise.reject(new Error('表单记录不存在。'));
    }

    return { schema, record: entities[0] };
  });
}
