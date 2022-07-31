import httpClient, { request, METHOD } from '@lib/http-client';
export type ApiDataType=[string, METHOD]

export function getOptionSetNames(params?: OptionSets): Promise<{ list: OptionSet[] }> {
  return httpClient('/api/v1/persona/dataset/m/getByCondition', params || {});
}

export function getOptionSetById(id: string): Promise<OptionSet> {
  const side = window.SIDE === 'home' ? 'home' : 'm';
  return httpClient(`/api/v1/persona/dataset/${side}/get`, { id });
}

export function createOptionSet(dataset: Omit<OptionSet, 'id'>): Promise<{ id: string }> {
  return httpClient('/api/v1/persona/dataset/m/create', dataset);
}

export function updateOptionSet(dataset: OptionSet): Promise<{ id?: string }> {
  return httpClient('/api/v1/persona/dataset/m/update', dataset);
}

export function deleteOptionSet(id: string): Promise<{ id?: string }> {
  return httpClient('/api/v1/persona/dataset/m/delete', { id });
}

export function getSelectApiData(
  value: ApiDataType|undefined,
  hasUser = false,
): Promise<OptionSetListItem[]> {
  if (!value) {
    return Promise.resolve([]);
  }
  const userData = window.USER;
  const [path, method]: ApiDataType = value;
  const apiUrl = `/api/v1/polyapi/request${path}`;
  const res = request<{entities: OptionSetListItem[]}>(apiUrl, method, hasUser ? userData : {});
  return res.then((val)=>{
    if (!val || !Array.isArray(val.entities)) {
      return [];
    }
    return val.entities;
  }).catch(()=>[]);
}
