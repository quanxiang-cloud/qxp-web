import httpClient from '@lib/http-client';

export function checkHasGroup(
  data:{group: string, appID: string},
): Promise<{groupID: string}> {
  return httpClient('/api/v1/midfielder/check/group', data);
}

export function checkIsDeveloper(): Promise<{isDeveloper: boolean}> {
  return httpClient('/api/v1/midfielder/check/developer');
}

export function checkInGroup(data:{group: string}): Promise<{isMember: boolean}> {
  return httpClient('/api/v1/midfielder/check/member', data);
}

export function createGroup(data:{group: string, appID: string}): Promise<{id: string}> {
  return httpClient('/api/v1/midfielder/group', data);
}

export function createDeveloper(data:{email: string}): Promise<void> {
  return httpClient('/api/v1/midfielder/user', data);
}

export function addToGroup(groupID: string, data:{memberID: string}): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/addmember`, data);
}

export function fetchFuncList(
  groupID: string,
  params: FuncListParams,
): Promise<{count: number, projects: FuncField[]}> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/list`, params);
}

export function getFuncVersionList(
  groupID: string,
  projectID: string,
  params: VersionListParams,
) : Promise<{count: number, Builds: VersionField[]}> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/list`, params);
}

export function createFaasFunc(
  groupID: string,
  data: FuncListParams,
): Promise<{id: string}> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project`, data);
}

export function getFuncInfo(groupID: string, projectID: string): Promise<{info: FuncField}> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/info`);
}

export function updateFuncDesc(
  groupID: string,
  projectID: string,
  data:{describe: string},
): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/updateDesc`, data);
}

