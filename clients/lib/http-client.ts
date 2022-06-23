import qs from 'qs';

import type { CustomPageInfo, ArteryPageInfo } from '@portal/modules/apps-management/pages/app-details/type';
import { saveConfig } from '@pageDesign/blocks/fountainhead/config';

// https://attacomsian.com/blog/javascript-current-timezone
function getTimeZone(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  if (offset === 0) {
    return 'UTC+0';
  }

  const delta = Math.abs(offset) / 60;

  if (offset > 0) {
    return `UTC-${delta}`;
  }

  return `UTC+${delta}`;
}

const TIME_ZONE = getTimeZone();

let alreadyAlertUnauthorizedError = false;

export type METHOD = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

const HEADERS: Record<string, any> = {
  'X-Proxy': 'API',
  'X-Timezone': TIME_ZONE,
  'Content-Type': 'application/json',
};

export function request<TData>(path: string, method: METHOD, body?: unknown): Promise<TData> {
  const requestInit: RequestInit = {
    method: method,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
    headers: HEADERS,
  };

  return fetch(path, requestInit)
    .then((response) => {
      if (response.status > 400) {
        return Promise.reject(new Error(response.statusText));
      }

      return response.json();
    })
    .then(({ code, msg, data }) => {
      if (code !== 0) {
        return Promise.reject(new Error(msg));
      }

      return data;
    })
    .catch((err) => {
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
  return httpClient.post<TData>(path, body || {});
}

httpClient.get = function<TData>(path: string, query?: Record<string, unknown>) {
  let _path = path;
  if (query) {
    _path = `${_path}?${qs.stringify(query)}`;
  }

  return request<TData>(_path, 'GET', undefined);
};

httpClient.post = function<TData>(path: string, body: unknown) {
  return request<TData>(path, 'POST', body);
};

httpClient.put = function<TData>(path: string, body: unknown) {
  return request<TData>(path, 'PUT', body);
};

httpClient.delete = function<TData>(path: string, body?: unknown) {
  return request<TData>(path, 'DELETE', body);
};

httpClient.patch = function<TData>(path: string, body?: unknown) {
  return request<TData>(path, 'PATCH', body);
};

// new end

export function getCustomPageInfo(appID: string, menuId: string): Promise<CustomPageInfo> {
  const side = window.SIDE === 'portal' ? 'm' : 'home';
  return httpClient(`/api/v1/form/${appID}/${side}/page/getByMenu`, { menuId });
}

export const fetchPageList = async (appID: string): Promise<fetchPageListRes> => {
  const side = window.SIDE === 'portal' ? 'm' : 'home';
  return await httpClient(`/api/v1/form/${appID}/${side}/menu/list`, { appID });
};

export function getArteryPageInfo(appID: string, tableID: string): Promise<ArteryPageInfo> {
  return httpClient(`/api/v1/form/${appID}/m/table/getInfo`, { tableID });
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
window.__syncConfig = saveConfig;

export default httpClient;
