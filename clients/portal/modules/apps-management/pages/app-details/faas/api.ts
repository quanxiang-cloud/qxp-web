import httpClient from '@lib/http-client';
import toast from '@lib/toast';

export function checkIsDeveloper(): Promise<{ userAccount: string }> {
  return httpClient.get('/api/v1/faas/check/developer');
}

export function checkHasGroup(
  params: { appID: string },
): Promise<string> {
  return httpClient.get<{ groupID: string }>('/api/v1/faas/check/group', params)
    .then(({ groupID }) => groupID || '')
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function checkInGroup(params: { groupID: string }): Promise<boolean> {
  return httpClient.get<{ isMember: boolean }>('/api/v1/faas/check/member', params)
    .then(({ isMember }) => isMember || false)
    .catch((err) => {
      toast.error(err);
      return false;
    });
}

export function createDeveloper(data: { account: string }): Promise<void> {
  return httpClient('/api/v1/faas/user', data);
}

export function createGroup(
  data: { name: string, describe: string, appID: string },
): Promise<string> {
  return httpClient<{groupID: string}>('/api/v1/faas/group', data)
    .then(({ groupID }) => groupID)
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function bindGroup(data: BindGroupParams): Promise<string> {
  return httpClient<{groupID: string}>('/api/v1/faas/group.bind', data)
    .then(({ groupID }) => groupID)
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function addToGroup(groupID: string): Promise<void> {
  return httpClient(`/api/v1/faas/${groupID}/member`, {});
}

type BindGroupParams = {
  appID: string,
  gid?: number,
  group?: string,
  describe?: string,
}

export function fetchGroupList(): Promise<Group[]> {
  return httpClient.get<{groups: Group[]}>('/api/v1/faas/groups')
    .then((res) => {
      return res.groups;
    })
    .catch((err) => {
      toast.error(err);
      return [];
    });
}

export function fetchFuncList(
  groupID: string,
  params: FuncListParams,
): Promise<{ count: number, projects: FuncField[] }> {
  return httpClient.get(`/api/v1/faas/${groupID}/projects`, params);
}

export function createFaasFunc(
  groupID: string,
  data: creatFuncParams,
): Promise<{ id: string, createdAt: number, creator: string }> {
  return httpClient(`/api/v1/faas/group/${groupID}/project`, data);
}

export function getFuncInfo(groupID: string, projectID: string): Promise< FuncField > {
  return httpClient.get(`/api/v1/faas/group/${groupID}/project/${projectID}`);
}

export function updateFuncDesc(
  groupID: string,
  projectID: string,
  data: { describe: string },
): Promise<void> {
  return httpClient.patch(`/api/v1/faas/group/${groupID}/project/${projectID}/desc`, data);
}

type BuildFucParams = {
  version: string,
  describe: string,
  projectID: string
  env: Record<string, string>
}

export function buildFunc(
  groupID: string,
  data: BuildFucParams): Promise<void> {
  return httpClient(`/api/v1/faas/group/${groupID}/project/create`, data);
}

export function deleteFunc(groupID: string, projectID: string): Promise<void> {
  return httpClient.delete(`/api/v1/faas/group/${groupID}/project/${projectID}`);
}

export function updateVerDesc(
  groupID: string,
  projectID: string,
  buildID: string,
  data: { describe: string },
): Promise<void> {
  return httpClient.patch(
    `/api/v1/faas/group/${groupID}/project/${projectID}/${buildID}/desc`, data,
  );
}

export function getFuncVersionList(
  groupID: string,
  projectID: string,
): Promise<{ count: number, data: VersionField[] }> {
  return httpClient.get(`/api/v1/faas/group/${groupID}/project/list/${projectID}`);
}

export function defineFunc(groupID: string, projectID: string): Promise<{ url: string }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/define`);
}

export function offlineVer(
  groupID: string,
  id: string,
): Promise<void> {
  return httpClient.delete(`/api/v1/faas/group/${groupID}/project/offline/${id}`);
}

export function servingVer(
  groupID: string,
  data: {id: string}): Promise<void> {
  return httpClient(`/api/v1/faas/group/${groupID}/project/serve`, data);
}

export function deleteVer(
  groupID: string,
  projectID: string,
  buildID: string,
): Promise<void> {
  return httpClient.delete(`/api/v1/faas/group/${groupID}/project/${projectID}/${buildID}`);
}

export function registerAPI(groupID: string, data: { buildID: string }): Promise<void> {
  return httpClient(`/api/v1/faas/group/${groupID}/project/regSwagger`, data);
}

export function getApiPath(groupID: string, projectID: string, buildID: string): Promise<{ path: string }> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/release/${buildID}/getApiPath`);
}

export function getVersionInfo(
  groupID: string,
  projectID: string,
  buildID: string,
): Promise<VersionField> {
  return httpClient.get(`/api/v1/faas/group/${groupID}/project/${projectID}/${buildID}`);
}
// export function getVersion(
//   groupID: string,
//   projectID: string,
//   buildID: string): Promise<{ build: VersionField }> {
//   return httpClient(`/api/v1/midfielder/group/${groupID}/project/${projectID}/build/${buildID}/get`);
// }

export function getBuildProcess(): Promise<FaasBuildProcess> {
  return httpClient.get<{data: {runs: string[], steps: string[][]}}>('/api/v1/faas/graph')
    .then((res) => res.data)
    .catch((err) => {
      toast.error(err);
      return { runs: [], steps: [] };
    });
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
  resourceRef: string,
  params: {step: string},
): Promise<{ logs: BuildLog[] }> {
  return httpClient.get(`/api/v1/faas/group/${groupID}/project/logger/${resourceRef}`, params);
}

type SubscribeParams = {
  topic: string;
  key: string;
  uuid: string;
}

export function wsSubscribe(params: SubscribeParams): Promise<TaskForm> {
  return httpClient('/api/v1/faas/cm/subscribe', params);
}

export function getGitLabDomain(): Promise<{ domain: string }> {
  return httpClient('/api/v1/midfielder/gitlab/domain');
}
