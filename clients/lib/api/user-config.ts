import httpClient from '@lib/http-client';
import logger from '@lib/logger';

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

export function cloneUserData(sourceKey: GetParams, targetKey: GetParams): Promise<any> {
  return httpClient('/api/v1/persona/cloneValue', { key: sourceKey, newKey: targetKey });
}

export function getBatchGlobalConfig(keys: GetParams[]): Promise<{ result: Record<string, string> }> {
  return httpClient<{ result: Record<string, string> }>('/api/v1/persona/batchGetValue', { keys }).catch((err) => {
    logger.error(err);
    return { result: {} };
  });
}

export function setBatchGlobalConfig(params: SetParams[]): FutureErrorMessage {
  return httpClient('/api/v1/persona/batchSetValue', { params }).then(() => '').catch((err) => {
    return err;
  });
}

export function setArteryEngineMenuType(appID: string, id: string): Promise<any> {
  return httpClient(`/api/v1/structor/${appID}/m/menu/toPage`, { id });
}
