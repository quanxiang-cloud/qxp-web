import qs from 'qs';

import { CustomPageInfo, SchemaPageInfo } from '@portal/modules/apps-management/pages/app-details/type';
import { ESParameter, toEs } from '@c/data-filter/utils';
import schemaToFields from '@lib/schema-convert';

import { TIME_ZONE } from './utils';

let alreadyAlertUnauthorizedError = false;

type METHOD = 'POST' | 'GET' | 'PUT' | 'DELETE';

const HEADERS: Record<string, any> = {
  'X-Proxy': 'API',
  'X-Timezone': TIME_ZONE,
  'Content-Type': 'application/json',
};

function request<TData>(path: string, method: METHOD, body?: unknown): Promise<TData> {
  const requestInit: RequestInit = {
    method: method,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
    headers: HEADERS,
  };

  return fetch(path, requestInit)
    .then((response) => response.json())
    .then(({ code, msg, data }) => {
      if (code !== 0) {
        return Promise.reject(new Error(msg));
      }

      return data;
    }).catch((err) => {
      if (err.response?.status === 401) {
        if (!alreadyAlertUnauthorizedError) {
          alreadyAlertUnauthorizedError = true;
          alert('当前会话已失效，请重新登录!');
        }

        window.location.reload();
        return Promise.reject(new Error('当前会话已失效，请重新登录!'));
      }

      return Promise.reject(err);
    });
}

function httpClient<TData>(path: string, body?: unknown): Promise<TData> {
  return httpClient.post<TData>(path, body);
}

httpClient.get = function<TData>(path: string, query?: Record<string, unknown>) {
  let _path = path;
  if (query) {
    _path = `${_path}?${qs.stringify(query)}`;
  }

  return request<TData>(_path, 'GET', undefined);
};

httpClient.post = function<TData>(path: string, body?: unknown) {
  return request<TData>(path, 'POST', body);
};

httpClient.put = function<TData>(path: string, body?: unknown) {
  return request<TData>(path, 'PUT', body);
};

httpClient.delete = function<TData>(path: string, body?: Body) {
  return request<TData>(path, 'DELETE', body);
};

export type FormDataRequestCreateParams = {
  method: 'create';
  entity: any;
}

export type FormDataRequestUpdateParams = {
  method: 'update';
  conditions?: {
    condition: Array<{ key: string; op: string; value: Array<string | number>; }>;
    tag?: 'and' | 'or';
  };
  entity: any;
  ref?: FormDataRequestUpdateParamsRef;
}

export type FormDataListResponse = { entities: Record<string, any>[]; total: number };

export type RefData = {
  updated?: Record<string, any>[];
  new?: (Record<string, any> | string)[];
  deleted?: string[];
}

export type FormDataRequestUpdateParamsRef = Record<string, RefData & {
  type: 'sub_table' | 'foreign_table' | 'serial' | 'aggregation' | 'associated_records';
  appID?: string;
  tableID?: string;
  sourceFieldId?: string;
  aggType?: string;
  fieldName?: string;
  query?: ESParameter | null;
}>;

export type FormDataResponse = { entity: Record<string, any>[]; errorCount: number; total: number };

export type FormDataBody = {
  entity?: Record<string, any>;
  ref?: FormDataRequestUpdateParamsRef;
}

export type FormDataListRequestParams = {
  query?: ESParameter;
  page?: number;
  size?: number;
  sort?: string[];
}

export function fetchFormDataList(
  appID: string,
  pageID: string,
  data: FormDataListRequestParams,
): Promise<FormDataListResponse> {
  return httpClient(`/api/v1/form/${appID}/home/form/${pageID}/search`, {
    method: 'find',
    page: 1,
    size: 10,
    ...data,
  });
}

export function createFormDataRequest(
  appID: string,
  tableID: string,
  params: FormDataBody,
): Promise<FormDataResponse> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/create`,
    params,
  );
}

export function editFormDataRequest(
  appID: string,
  tableID: string,
  dataID: string,
  params: FormDataBody,
): Promise<FormDataResponse> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/update`,
    {
      ...params,
      query: {
        terms: { _id: [dataID] },
      },
    },
  );
}

export function buildQueryRef(schema: ISchema): FormDataRequestUpdateParamsRef {
  const refFields = schemaToFields(schema, (schemaField) => {
    return ['SubTable', 'AggregationRecords', 'AssociatedRecords'].includes(schemaField['x-component'] || '');
  });

  const ref: FormDataRequestUpdateParamsRef = {};
  if (refFields.length) {
    refFields.forEach((field) => {
      switch (field.componentName) {
      case 'subtable': {
        const { subordination, appID, tableID } = field?.['x-component-props'] || {};
        ref[field.id] = {
          type: subordination || 'sub_table',
          appID,
          tableID,
        };
        break;
      }
      case 'associatedrecords': {
        const { appID, tableID } = field?.['x-component-props'] || {};
        ref[field.id] = {
          type: 'associated_records',
          appID,
          tableID,
        };
        break;
      }
      case 'aggregationrecords': {
        const {
          sourceFieldId,
          appID,
          tableID,
          aggType,
          fieldName,
          condition,
        } = field?.['x-component-props'] || {};

        ref[field.id] = {
          type: 'aggregation',
          query: condition ? toEs(condition) : null,
          tableID,
          appID,
          sourceFieldId,
          aggType,
          fieldName,
        };
        break;
      }
      }
    });
  }

  return ref;
}

export function findOneFormDataRequest(
  appID: string,
  tableID: string,
  rowID: string,
  schema: ISchema,
): Promise<Record<string, any>> {
  if (!rowID) {
    return Promise.resolve({});
  }

  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/get`,
    {
      ref: buildQueryRef(schema),
      query: {
        bool: {
          must: [
            {
              term: { _id: rowID },
            },
          ],
        },
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

export function delFormDataRequest(
  appID: string,
  tableID: string,
  rowIDs: string[],
): Promise<Record<string, any>> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/delete`,
    {
      query: {
        terms: { _id: rowIDs },
      },
    },
  );
}

export async function fetchOneFormDataWithSchema(
  appID: string,
  tableID: string,
  rowID: string,
): Promise<{ schemaRes?: GetTableSchemaResponse, record?: Record<string, any> }> {
  const schemaRes = await getTableSchema(appID, tableID);
  if (!schemaRes?.schema) {
    return {};
  }

  const record = await findOneFormDataRequest(appID, tableID, rowID, schemaRes.schema);
  return { schemaRes, record };
}

// new end

type GetTableSchemaResponse = null | { config: any; schema: ISchema; };

export function getTableSchema(appID: string, tableID: string): Promise<GetTableSchemaResponse> {
  const path = window.SIDE === 'home' ?
    `/api/v1/form/${appID}/home/schema/${tableID}` :
    `/api/v1/form/${appID}/m/table/getByID`;

  return httpClient<GetTableSchemaResponse>(path, { tableID });
}

export function getCustomPageInfo(appID: string, menuId: string): Promise<CustomPageInfo> {
  const side = window.SIDE === 'portal' ? 'm' : 'home';
  return httpClient(`/api/v1/structor/${appID}/${side}/page/getByMenu`, { menuId });
}

export const fetchPageList = async (appID: string): Promise<fetchPageListRes> => {
  const side = window.SIDE === 'portal' ? 'm' : 'home';
  return await httpClient(`/api/v1/structor/${appID}/${side}/menu/list`, { appID });
};

export function getSchemaPageInfo(appID: string, menuId: string): Promise<SchemaPageInfo> {
  return httpClient(`/api/v1/structor/${appID}/m/table/getInfo`, { menuId });
}

export function saveTableSchema(
  appID: string, tableID: string, schema: ISchema, source?: SchemaSource,
): Promise<{ tableID: string; }> {
  return httpClient(
    `/api/v1/form/${appID}/m/table/create`,
    { tableID, schema, source },
  );
}

export async function httpClientGraphQL<TData>(
  path: string,
  params?: unknown,
  additionalHeaders?: HeadersInit,
): Promise<TData> {
  const headers = {
    'X-Proxy': 'API',
    'Content-Type': 'application/json',
    'X-Timezone': TIME_ZONE,
    ...additionalHeaders,
  };

  const _path = params ? `${path}?${qs.stringify(params)}` : path;

  const response = await fetch(_path, {
    method: 'GET',
    headers: headers,
  });
  if (response.status === 401) {
    alert('当前会话已失效，请重新登录!');
    window.location.reload();
    return Promise.reject(new Error('当前会话已失效，请重新登录!'));
  }
  if (response.status === 500) {
    return Promise.reject(new Error('请求失败!'));
  }
  const resp = await response.json();
  const { code, msg, data } = resp;
  if (code !== 0) {
    const e = new Error(msg);
    if (data) {
      Object.assign(e, { data });
    }
    return Promise.reject(e);
  }
  return data as TData;
}

window.__httpClient = httpClient;

export default httpClient;
