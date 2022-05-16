import manifest from './manifest.json';
import propsSpec from './props-spec.json';

export const params = [{
  key: 'PACKAGE_MANIFEST:ofa-ui',
  version: '1.0.0',
  value: JSON.stringify(manifest),
}];
// __httpClient('/api/v1/persona/batchSetValue', { keys: params });

export const specParams = [{
  key: 'PACKAGE_PROPS_SPEC:ofa-ui',
  version: '1.0.0',
  value: JSON.stringify(propsSpec),
}];
// __httpClient('/api/v1/persona/batchSetValue', { keys: specParams });
