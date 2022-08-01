import httpClient from '@lib/http-client';

type PersonaParam = {
  key: string | string[];
  version: string;
};

export function triggerScssCompile(params: {
  appID: string;
  element: string;
}): Promise<any> {
  return httpClient('/api/v1/web-processors/execute', params);
}
