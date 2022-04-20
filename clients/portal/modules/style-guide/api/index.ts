import httpClient from '@lib/http-client';

type PersonaParam = {
  key: string | string[];
  version: string;
};

export function triggerScssCompile(params: {
  design_token_key: PersonaParam,
  components_scss_keys: PersonaParam,
}): Promise<any> {
  return httpClient('/api/v1/assign/exec', params);
}
