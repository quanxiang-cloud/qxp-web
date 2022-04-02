import { has, mergeRight } from 'ramda';

import type { Directory, API, PathType, DirectoryChild } from './types';

export const http = {
  post: async (url: string, data: Record<string, unknown>): Promise<any> => {
    const { default: httpClient } = await import('@lib/http-client');
    return httpClient.post(url, data, { 'X-Proxy': 'API' });
  },
};

async function getDirectoryPath(appID: string, pathType: string): Promise<string> {
  const params = { appID, pathType };
  const { appPath } = await http.post('/api/v1/polyapi/namespace/appPath', params);
  return appPath;
}

export async function getDirectory(directoryPath: string): Promise<Directory> {
  const params = { active: -1 };
  const { root } = await http.post(`/api/v1/polyapi/namespace/tree${directoryPath}`, params);
  return root;
}

interface DirectoryPathWithPathType {
  pathType: PathType;
  directoryPath: string;
}
export async function getDirectoryPathWithPathTypeArray(
  appID: string, pathTypes: PathType[],
): Promise<DirectoryPathWithPathType[]> {
  const promises = pathTypes.map(async (pathType) => {
    const directoryPath = await getDirectoryPath(appID, pathType);
    return { pathType, directoryPath };
  });
  return await Promise.all(promises);
}

export async function getApiList(directoryPath: string, listType: 'raw' | 'poly'): Promise<API[]> {
  const params = { active: -1 };
  const { list } = await http.post(`/api/v1/polyapi/${listType}/list${directoryPath}`, params);
  return list;
}

function isDirectory(directoryChild: DirectoryChild): directoryChild is Directory {
  return directoryChild.category === 'directory' || has('children', directoryChild);
}

export function isApi(directoryChild: DirectoryChild): directoryChild is API {
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

export function setPathTypeAndCategoryToDirectory(pathType: PathType, directory: Directory): Directory {
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
export function addApiListToDirectory(params: AddApiToDirectoryParams): Directory {
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

export function omitApiFromDirectory(directory: Directory): Directory {
  const children = directory.children || [];
  const newChildren = children.filter(isDirectory);

  return {
    ...directory,
    children: newChildren.map(omitApiFromDirectory),
  };
}

export function findDirectoryFromDirectory(
  directory: Directory, directoryPath: string,
): Directory | undefined {
  const { parent, name } = directory;
  const currentDirectoryPath = `${parent}/${name}`;
  let targetDirectory: Directory | undefined;
  if (currentDirectoryPath === directoryPath) {
    targetDirectory = directory;
  } else {
    targetDirectory = findDirectoryFromChildren(directory.children, directoryPath);
  }
  return targetDirectory;
}

function findDirectoryFromChildren(
  directoryChildren: DirectoryChild[] | null,
  directoryPath: string,
): Directory | undefined {
  for (const child of directoryChildren || []) {
    if (isDirectory(child)) {
      const { parent, name } = child;
      const childPath = `${parent}/${name}`;
      if (childPath === directoryPath) {
        return child;
      }
      return findDirectoryFromDirectory(child, directoryPath);
    }
  }
}
