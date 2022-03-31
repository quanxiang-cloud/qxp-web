import { APIDirectory, APIItem } from './types';

function setRequestHeaders(request: XMLHttpRequest, headers: Record<string, string>): void {
  Object.entries(headers).forEach(([key, value]) => {
    request.setRequestHeader(key, value);
  });
}

export const http = {
  post: (url: string, data: string): Promise<string> => {
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    setRequestHeaders(request, {
      'Content-type': 'application/json; charset=utf-8',
      'X-Proxy': 'API',
    });
    return new Promise((resolve, reject) => {
      request.onload = () => resolve(request.responseText),
      request.onerror = () => reject(request);
      request.send(data);
    });
  },
};

export function getDirectoryPath(directory: APIDirectory): string {
  const { parent, name } = directory;
  return `${parent}/${name}`;
}

export async function getApiRootDirectoryPath(appID: string, apiType: string): Promise<string> {
  const params = { appID, pathType: apiType };
  const res = await http.post('/api/v1/polyapi/namespace/appPath', JSON.stringify(params));
  const { data: { appPath } } = JSON.parse(res);
  return appPath;
}

export async function getApiRootDirectory(rootDirectoryPath: string): Promise<APIDirectory> {
  const params = { active: -1 };
  const res = await http.post(`/api/v1/polyapi/namespace/tree${rootDirectoryPath}`, JSON.stringify(params));
  const { data: { root } } = JSON.parse(res);
  return root;
}

export interface ApiRootDirectoryPathWithApiType {
  type: string;
  apiRootDirectoryPath: string;
}
export async function getApiRootDirectoryPathWithTypeArray(
  appID: string, apiTypes: string[],
): Promise<ApiRootDirectoryPathWithApiType[]> {
  const promises = apiTypes.map(async (type) => {
    const apiRootDirectoryPath = await getApiRootDirectoryPath(appID, type);
    return { type, apiRootDirectoryPath };
  });
  return await Promise.all(promises);
}

export async function getApiList(directoryPath: string, listType: 'raw' | 'poly'): Promise<APIItem[]> {
  const params = { active: -1 };
  const res = await http.post(`/api/v1/polyapi/${listType}/list${directoryPath}`, JSON.stringify(params));
  const { data: { list } } = JSON.parse(res);
  return list;
}

export async function getApiDoc(apiFullPath: string, docType: string): Promise<Record<string, any>> {
  const params = { docType, titleFirst: true };
  const res = await http.post(`/api/v1/polyapi/doc${apiFullPath}`, JSON.stringify(params));
  return JSON.parse(res);
}
