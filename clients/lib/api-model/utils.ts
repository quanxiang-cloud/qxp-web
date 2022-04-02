import { has, mergeRight } from 'ramda';

import { Directory, API, PathType, DirectoryChild } from './types';
import { APIData, ModelState } from '.';

export const http = {
  post: (url: string, data: Record<string, unknown>): Promise<any> => {
    return import('@lib/http-client').then(({ default: httpClient }) => {
      httpClient.post(url, data, { 'X-Proxy': 'API' });
    });
  },
};

async function getDirectoryPath(appID: string, pathType: string): Promise<string> {
  const params = { appID, pathType };
  const { appPath } = await http.post('/api/v1/polyapi/namespace/appPath', params);
  return appPath;
}

async function getDirectory(directoryPath: string): Promise<Directory> {
  const params = { active: -1 };
  const { root } = await http.post(`/api/v1/polyapi/namespace/tree${directoryPath}`, params);
  return root;
}

interface DirectoryPathWithPathType {
  pathType: PathType;
  directoryPath: string;
}
async function getDirectoryPathWithPathTypeArray(
  appID: string, pathTypes: PathType[],
): Promise<DirectoryPathWithPathType[]> {
  const promises = pathTypes.map(async (pathType) => {
    const directoryPath = await getDirectoryPath(appID, pathType);
    return { pathType, directoryPath };
  });
  return await Promise.all(promises);
}

async function getApiList(directoryPath: string, listType: 'raw' | 'poly'): Promise<API[]> {
  const params = { active: -1 };
  const { list } = await http.post(`/api/v1/polyapi/${listType}/list${directoryPath}`, params);
  return list;
}

function isDirectory(directoryChild: DirectoryChild): directoryChild is Directory {
  return directoryChild.category === 'directory' || has('children', directoryChild);
}

function isApi(directoryChild: DirectoryChild): directoryChild is API {
  return directoryChild.category === 'api' || !has('children', directoryChild);
}

function setPathTypeToDirectoryChildren(
  pathType: PathType, directoryChildren: DirectoryChild[] | null,
): DirectoryChild[] | null {
  if (!directoryChildren) {
    return null;
  }
  return directoryChildren.map((child) => {
    if (isDirectory(child)) {
      return setPathTypeAndCategoryToDirectory(pathType, child);
    }
    if (isApi(child)) {
      return setPathTypeAndCategoryToApiItem(pathType, child);
    }
    return child;
  });
}

function setPathTypeAndCategoryToDirectory(pathType: PathType, directory: Directory): Directory {
  return mergeRight(directory, {
    pathType,
    category: 'directory',
    children: setPathTypeToDirectoryChildren(pathType, directory.children),
  });
}

function setPathTypeAndCategoryToApiItem(pathType: PathType, apiItem: API): API {
  return mergeRight(apiItem, { pathType, category: 'api' });
}

interface AddApiToDirectoryParams {
  directory: Directory;
  apiList: API[];
  directoryPath: string;
}
function addApiListToDirectory(params: AddApiToDirectoryParams): Directory {
  const { directory, apiList, directoryPath } = params;
  const path = `${directory.parent}/${directory.name}`;
  if (!directory.children) {
    directory.children = [];
  }
  if (path === directoryPath) {
    directory.children = directory.children.concat(apiList);
  } else {
    directory.children = directory.children.map((child) => {
      if (isDirectory(child)) {
        return addApiListToDirectory({ directory: child, apiList, directoryPath });
      }
      return child;
    });
  }
  return directory;
}

interface GetApiDataMapperParams {
  pathType: PathType;
  apiList: API[];
  directoryPath: string;
}
function getUpdateApiDataDirectoryByApiListMapper(
  params: GetApiDataMapperParams,
): (apiData: APIData) => APIData {
  const { pathType, apiList, directoryPath } = params;
  return (apiData: APIData) => {
    if (apiData.pathType !== pathType) {
      return apiData;
    }
    const { directory } = apiData;
    return {
      directory: addApiListToDirectory({ directory, apiList, directoryPath }),
      pathType,
    };
  };
}

interface GetApiListAndUpdateApiDataListParams {
  apiDataList: APIData[];
  directoryPath: string;
  pathType: PathType;
}
export async function getApiListAndUpdateApiDataList(
  params: GetApiListAndUpdateApiDataListParams,
): Promise<APIData[]> {
  const { pathType, directoryPath, apiDataList } = params;
  const listType = pathType === PathType.POLY ? 'poly' : 'raw';
  const apiList = await getApiList(directoryPath, listType);
  return apiDataList.map(getUpdateApiDataDirectoryByApiListMapper({ pathType, apiList, directoryPath }));
}

interface GetInitialApiDataParams {
  pathType: PathType;
  directoryPath: string;
}
async function getInitialApiData(params: GetInitialApiDataParams): Promise<APIData> {
  const { pathType, directoryPath } = params;
  const directory = await getDirectory(directoryPath);
  return {
    pathType,
    directory: setPathTypeAndCategoryToDirectory(pathType, directory),
  };
}

export async function getInitialApiDataList(appID: string, pathTypes: PathType[]): Promise<APIData[]> {
  const directoryPathWithPathTypeArray = await getDirectoryPathWithPathTypeArray(appID, pathTypes);
  const apiDataListPromises = directoryPathWithPathTypeArray.map(getInitialApiData);
  return await Promise.all(apiDataListPromises);
}

export function omitApiFromModelValue({ apiDataList }: ModelState): ModelState {
  return {
    apiDataList: apiDataList.map(({ pathType, directory }) => ({
      pathType,
      directory: omitApiFromDirectory(directory),
    })),
  };
}

function omitApiFromDirectory(directory: Directory): Directory {
  const children = directory.children || [];
  const newChildren = children.filter(isDirectory);

  return {
    ...directory,
    children: newChildren.map(omitApiFromDirectory),
  };
}
