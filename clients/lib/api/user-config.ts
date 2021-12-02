import httpClient from '@lib/http-client';

type GetParams = {
  version: string;
  key: string;
}

type SetParams = GetParams & {
  value: string;
}

export function getBatchUserData(keys: GetParams[]): Promise<{ result: Record<string, string> }> {
  return httpClient('/api/v1/persona/userBatchGetValue', { keys });
}

export function setBatchUserData(params: SetParams[]) {
  return httpClient('/api/v1/persona/userBatchSetValue', { params });
}
