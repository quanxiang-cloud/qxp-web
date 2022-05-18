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

export function setBatchUserData(keys: SetParams[]): Promise<void> {
  return httpClient('/api/v1/persona/userBatchSetValue', { keys });
}

export function cloneUserData(sourceKey: GetParams, targetKey: GetParams): Promise<any> {
  return httpClient('/api/v1/persona/cloneValue', { key: sourceKey, newKey: targetKey });
}

export async function getBatchGlobalConfig(keys: GetParams[]): Promise<{ result: Record<string, string> }> {
  try {
    return await httpClient<{ result: Record<string, string>; }>('/api/v1/persona/batchGetValue', { keys });
  } catch (err) {
    logger.error(err);
    return { result: {} };
  }
}

export function setBatchGlobalConfig(keys: SetParams[]): FutureErrorMessage {
  return httpClient('/api/v1/persona/batchSetValue', { keys }).then(() => '').catch((err) => {
    return err;
  });
}

export function setGlobalConfig(key: string, version: string, value: Record<string, any>): void {
  setBatchGlobalConfig([{ key, version, value: JSON.stringify(value) }]);
}

export function setArteryEngineMenuType(appID: string, id: string): Promise<any> {
  return httpClient(`/api/v1/form/${appID}/m/menu/toPage`, { id });
}
