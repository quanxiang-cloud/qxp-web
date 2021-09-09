import qs from 'qs';
import { CustomPageInfo, SchemaPageInfo } from '@portal/modules/apps-management/pages/app-details/type';

function httpClient<TData>(path: string, body?: unknown, additionalHeaders?: HeadersInit): Promise<TData> {
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
      const e = new Error(msg);
      if (data) {
        Object.assign(e, { data });
      }
      return Promise.reject(e);
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

export type FormDataRequestCreateParams = {
  method: 'create';
  entity: any;
}

export type FormDataRequestUpdateParamsRef = Record<string, {
  appID: string;
  tableID: string;
  updated: Record<string, any>[];
  new: Record<string, any>[];
  deleted: string[];
}>;

export type FormDataRequestUpdateParams = {
  method: 'update';
  conditions?: {
    condition: Array<{ key: string; op: string; value: Array<string | number>; }>;
    tag?: 'and' | 'or';
  };
  entity: any;
  ref?: FormDataRequestUpdateParamsRef;
}

export type FormDataRequestParams =
  FormDataRequestQueryDeleteParams |
  FormDataRequestCreateParams |
  FormDataRequestUpdateParams;

export type FormDataResponse = { entity: any; errorCount: number; };

export function formDataRequest(
  appID: string,
  tableID: string,
  params: FormDataRequestParams,
): Promise<FormDataResponse> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}`,
    params,
  );
}

type GetTableSchemaResponse = null | { config: any; schema: ISchema; };

export function getTableSchema(appID: string, tableID: string): Promise<GetTableSchemaResponse> {
  const path = window.SIDE === 'home' ?
    `/api/v1/form/${appID}/home/schema/${tableID}` :
    `/api/v1/form/${appID}/m/table/getByID`;

  return httpClient<GetTableSchemaResponse>(path, { tableID });
}

export function getCustomPageInfo(appID: string, menuId: string): Promise<CustomPageInfo> {
  return httpClient(`/api/v1/structor/${appID}/m/page/getByMenu`, { menuId });
}

export function getSchemaPageInfo(appID: string, menuId: string): Promise<SchemaPageInfo> {
  return httpClient(`/api/v1/structor/${appID}/m/table/getInfo`, { menuId });
}

export function findOneRecord(appID: string, tableID: string, id: string): Promise<Record<string, any>> {
  if (!id) {
    return Promise.resolve({});
  }

  return formDataRequest(
    appID,
    tableID,
    {
      method: 'findOne',
      conditions: {
        condition: [{ key: '_id', op: 'eq', value: [id] }],
      },
    },
  ).then(({ entity }) => {
    if (!entity) {
      // 只查 schema 的时候不要 reject
      return {};
    }

    return entity;
  });
}

export function saveTableSchema(
  appID: string, tableID: string, schema: ISchema, source?: SchemaSource,
): Promise<{ tableID: string; }> {
  return httpClient(
    `/api/v1/form/${appID}/m/table/create`,
    { tableID, schema, source },
  );
}

export function httpClientGraphQL<TData>(
  path: string,
  params?: unknown,
  additionalHeaders?: HeadersInit,
): Promise<TData> {
  const headers = {
    'X-Proxy': 'API',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  const _path = params ? `${path}?${qs.stringify(params)}` : path;

  return fetch(_path, {
    method: 'GET',
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
      const e = new Error(msg);
      if (data) {
        Object.assign(e, { data });
      }
      return Promise.reject(e);
    }

    return data as TData;
  });
}

export default httpClient;
