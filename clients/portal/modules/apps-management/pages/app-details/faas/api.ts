import httpClient from '@lib/http-client';

export function checkHasGroup(
  data: { group: string, appID: string },
): Promise<{ groupID: string }> {
  return httpClient('/api/v1/midfielder/check/group', data);
}

export function checkIsDeveloper(): Promise<{ isDeveloper: boolean }> {
  return httpClient.post('/api/v1/midfielder/check/developer', {});
}

export function checkInGroup(data: { group: string }): Promise<{ isMember: boolean }> {
  return httpClient('/api/v1/midfielder/check/member', data);
}

export function createGroup(data: { group: string, appID: string }): Promise<{ id: string }> {
  return httpClient('/api/v1/midfielder/group', data);
}

export function createDeveloper(data: { email: string, publicKey: string }): Promise<void> {
  return httpClient('/api/v1/midfielder/user', data);
}

export function addToGroup(groupID: string, data: { memberID: string }): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/addmember`, data);
}

export function fetchFuncList(
  groupID: string,
  params: FuncListParams,
): Promise<{ count: number, projects: FuncField[] }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/list`, params);
}

export function createFaasFunc(
  groupID: string,
  data: creatFuncParams,
): Promise<{ id: string, createdAt: number, creator: string }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project`, data);
}

export function getFuncInfo(groupID: string, projectID: string): Promise<{ info: FuncField }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/info`);
}

export function updateFuncDesc(
  groupID: string,
  projectID: string,
  data: { describe: string },
): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/updateDesc`, data);
}

export function defineFunc(groupID: string, projectID: string): Promise<{ url: string }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/define`);
}

export function buildFunc(
  groupID: string,
  projectID: string,
  data: { tag: string, describe: string }): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build`, data);
}

export function deleteFunc(groupID: string, projectID: string): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/delete`);
}

export function updateVerDesc(
  groupID: string,
  projectID: string,
  buildID: string,
  data: { describe: string },
): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/updateDesc`, data);
}

export function getFuncVersionList(
  groupID: string,
  projectID: string,
  params: VersionListParams,
): Promise<{ count: number, builds: VersionField[] }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/list`, params);
}

export function getVersion(
  groupID: string,
  projectID: string,
  buildID: string): Promise<{ build: VersionField }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/get`);
}

export function offlineVer(
  groupID: string,
  projectID: string,
  buildID: string): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/release/${buildID}/offline`);
}

export function servingVer(
  groupID: string,
  projectID: string,
  buildID: string): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/release/${buildID}/serving`);
}

export function deleteVer(
  groupID: string,
  projectID: string,
  buildID: string,
): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/delete`);
}

export function registerAPI(groupID: string, projectID: string, buildID: string): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/release/${buildID}/registerApi`);
}

export function getApiPath(groupID: string, projectID: string, buildID: string): Promise<{ path: string }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/release/${buildID}/getApiPath`);
}

export function getVersionInfo(
  groupID: string,
  projectID: string,
  buildID: string,
): Promise<{ build: VersionField }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/get`);
}

export function getBuildProcess(
  groupID: string,
  projectID: string,
  buildID: string,
): Promise<FaasBuildProcess> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/graph`);
}

export function getBuildProcessStatus(
  groupID: string,
  projectID: string,
  buildID: string,
): Promise<{ events: FaasBuildStatus[] }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/event`);
}

export function getBuildLog(
  groupID: string,
  projectID: string,
  buildID: string,
  position: { index: number },
): Promise<{ logs: BuildLog[] }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/logger`, position);
}

type SubscribeParams = {
  topic: string;
  key: string;
  uuid: string;
}

export function wsSubscribe(params: SubscribeParams): Promise<TaskForm> {
  return httpClient('/api/v1/midfielder/cm/subscribe', params);
}

export function getGitLabDomain(): Promise<{ domain: string }> {
  return httpClient('/api/v1/midfielder/gitlab/domain');
}
