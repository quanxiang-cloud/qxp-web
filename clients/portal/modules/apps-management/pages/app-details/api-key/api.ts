import httpClient from '@lib/http-client';

export function createApiKey(
  title: string, description: string,
): Promise<ApiKey> {
  return httpClient(
    '/api/v1/polyapi/apikey/create',
    { title, description },
  );
}

export function getApiKeyList(): Promise<keyListData> {
  return httpClient(
    '/api/v1/polyapi/apikey/list',
    { page: 1, limit: 5 },
  );
}

export function updateApiKey(
  keyID: string, title: string, description: string,
): Promise<void> {
  return httpClient(
    '/api/v1/polyapi/apikey/update',
    { keyID, title, description },
  );
}

export function deleteApiKey(
  keyID: string,
): Promise<void> {
  return httpClient(
    '/api/v1/polyapi/apikey/delete',
    { keyID },
  );
}

export function activeApiKey(
  keyID: string, active: number,
): Promise<void> {
  return httpClient(
    '/api/v1/polyapi/apikey/active',
    { keyID, active },
  );
}

export function getOneApiKey(
  keyID: string,
): Promise<ApiKeyList> {
  return httpClient(
    '/api/v1/polyapi/apikey/query',
    { keyID },
  );
}
