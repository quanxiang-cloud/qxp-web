import httpClient from '@lib/http-client';

export function getOptionSetNames(params?: OptionSets): Promise<{ list: OptionSet[] }> {
  return httpClient('/api/v1/structor/dataset/m/getByCondition', params);
}

export function getOptionSetById(id: string): Promise<OptionSet> {
  const side = window.SIDE === 'home' ? 'home' : 'm';
  return httpClient(`/api/v1/structor/dataset/${side}/get`, { id });
}

export function createOptionSet(dataset: Omit<OptionSet, 'id'>): Promise<{ id: string }> {
  return httpClient('/api/v1/structor/dataset/m/create', dataset);
}

export function updateOptionSet(dataset: OptionSet): Promise<{ id?: string }> {
  return httpClient('/api/v1/structor/dataset/m/update', dataset);
}

export function deleteOptionSet(id: string): Promise<{ id?: string }> {
  return httpClient('/api/v1/structor/dataset/m/delete', { id });
}
