import httpClient from '@lib/http-client';

export type ProjectParams = {
  size: number,
  page: number,
}

export type AssociateParams = {
  projectID: string,
  projectName: string,
  add: {
    userID: string,
    userName: string,
  }[],
  removes: {
    userID: string,
    userName: string,
  }[]
}

export type ProjectWithPerson = {
  id: string
  projectID: string,
  projectName: string,
  userID: string,
  userName: string,
}

export type Project = {
  id: string,
  name: string;
  description?: string;
  serialNumber?: string;
  startAt?: number;
  endAt?: number;
  status?: string;
}

export function fetchProjectList(
  params: ProjectParams,
): Promise<{ list: Project[], total: number; }> {
  return httpClient('/api/v1/form/project/m/list', params);
}

export async function createProject(data: Omit<Project, 'id'>): Promise<{id: string}> {
  return await httpClient('/api/v1/form/project/m/create', data);
}

export async function editProject(data: Project): Promise<void> {
  return await httpClient('/api/v1/form/project/m/update', data);
}

export function associatePerson(
  params: AssociateParams,
): Promise<{ list: Project[], total: number; }> {
  return httpClient('/api/v1/form/project/m/grant/user', params);
}

export function getAssociatePerson(
  params: {page: number, size: number, projectID: string},
): Promise<{ list: ProjectWithPerson[], total: number }> {
  return httpClient<{ list: ProjectWithPerson[], total: number }>(
    '/api/v1/form/project/m/grant/list', params,
  ).then((res) => {
    return { list: res.list || [], total: res.total || 0 };
  }).catch(() => {
    return { list: [], total: 0 };
  });
}

export async function deleteProject(id: string): Promise<any> {
  return await httpClient('/api/v1/form/project/m/delete', { id });
}
