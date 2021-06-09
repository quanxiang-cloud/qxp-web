function httpClient<TData>(
  path: string, body?: any, additionalHeaders?: HeadersInit,
): Promise<TData> {
  const headers = {
    'X-Proxy': 'API',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  return fetch(path, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    headers: headers,
  }).then((response) => {
    if (response.status === 401) {
      alert('当前会话已失效，请重新登录!');
      window.location.reload();
      return Promise.reject(new Error('当前会话已失效，请重新登录!'));
    }
    if (response.status === 500) {
      return Promise.reject(new Error('请求失败!'));
    }
    return response.json();
  }).then((resp) => {
    const { code, msg, data } = resp;
    if (code !== 0) {
      return Promise.reject(new Error(msg));
    }

    return data as TData;
  });
}

type FormDataRequestQueryDeleteParams = {
  method: 'find' | 'findOne' | 'delete';
  conditions: {
    condition: Array<{ key: string; op: string; value: Array<string | number>; }>;
    tag?: 'and' | 'or';
  }
}

type FormDataRequestCreateParams = {
  method: 'create';
  entity: any;
}

type FormDataRequestUpdateParams = {
  method: 'update';
  condition: {
    condition: Array<{ key: string; op: string; value: Array<string | number>; }>;
    tag?: 'and' | 'or';
  };
  entity: any;
  ref?: Record<string, {
    appID: string;
    table: string;
    updated: Array<any>;
    new: Array<any>;
    deleted: string[];
  }>;
}

type FormDataRequestParams =
  FormDataRequestQueryDeleteParams |
  FormDataRequestCreateParams |
  FormDataRequestUpdateParams;

type FormDataResponse = { entities: Array<any>; total: number; };

export function formDataRequest(appID: string, tableID: string, params: FormDataRequestParams) {
  return httpClient<FormDataResponse>(
    `/api/v1/structor/${appID}/home/form/${tableID}`,
    params,
    { 'X-Proxy': 'FORM_DATA' }
  );
}

type GetTableSchemaResponse = { config: any; id: string; schema?: ISchema; tableID: string; };

export function getTableSchema(appID: string, tableID: string) {
  const path = window.SIDE === 'home' ?
    `/api/v1/structor/${appID}/home/schema/${tableID}` :
    `/api/v1/structor/${appID}/m/table/getByID`;

  return httpClient<GetTableSchemaResponse>(path, { tableID }, { 'X-Proxy': 'FORM_SCHEMA' });
}

export function saveTableSchema(appID: string, tableID: string, schema: ISchema) {
  return httpClient(
    `/api/v1/structor/${appID}/m/table/create`,
    { tableID, schema },
    { 'X-Proxy': 'FORM_SCHEMA' },
  );
}

export default httpClient;
