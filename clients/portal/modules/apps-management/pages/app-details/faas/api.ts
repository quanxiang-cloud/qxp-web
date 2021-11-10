import httpClient from '@lib/http-client';

import { FuncListParams } from 'clients/types/faas';

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

export function createDeveloper(data:{email: string}) {
  return httpClient('/api/v1/midfielder/user', data);
}

export function addToGroup(groupID: string, data:{memberID: string}): Promise<void> {
  return httpClient(`/api/v1/midfielder/group/${groupID}/addmember`, data);
}

export function fetchFuncList(
  groupID: string,
  params: FuncListParams,
): Promise<void> {
  return httpClient(`/api/v1/faas/group/${groupID}/list`, params);
}
