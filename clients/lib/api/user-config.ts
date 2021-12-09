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

export function setBatchUserData(params: SetParams[]): Promise<void> {
  return httpClient('/api/v1/persona/userBatchSetValue', { params });
}

export function getBatchGlobalConfig(keys: GetParams[]): Promise<{ result: Record<string, string> }> {
  return httpClient('/api/v1/persona/batchGetValue', { keys });
}

export function setBatchGlobalConfig(params: SetParams[]): Promise<void> {
  return httpClient('/api/v1/persona/batchSetValue', { params });
}
