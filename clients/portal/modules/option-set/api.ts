import httpClient from '@lib/http-client';

export function getOptionSetNames(params?: OptionSets): Promise<{ list: OptionSet[] }> {
  return httpClient('/api/v1/form/dataset/m/getByCondition', params || {});
}

export function getOptionSetById(id: string): Promise<OptionSet> {
  const side = window.SIDE === 'home' ? 'home' : 'm';
  return httpClient(`/api/v1/form/dataset/${side}/get`, { id });
}

export function createOptionSet(dataset: Omit<OptionSet, 'id'>): Promise<{ id: string }> {
  return httpClient('/api/v1/form/dataset/m/create', dataset);
}

export function updateOptionSet(dataset: OptionSet): Promise<{ id?: string }> {
  return httpClient('/api/v1/form/dataset/m/update', dataset);
}

export function deleteOptionSet(id: string): Promise<{ id?: string }> {
  return httpClient('/api/v1/form/dataset/m/delete', { id });
}
