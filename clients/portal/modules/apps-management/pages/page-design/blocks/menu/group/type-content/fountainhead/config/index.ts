import packages from './packages';

export const params = [{
  key: 'PACKAGES',
  version: '1.0.0',
  value: JSON.stringify(packages),
}];
// __httpClient('/api/v1/persona/batchSetValue', { keys: params });
