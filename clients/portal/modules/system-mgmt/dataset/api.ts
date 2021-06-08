import httpClient from '@lib/http-client';

export const getDatasetNames = async (filters?: Record<string, unknown>): Promise<{ list: Dataset[] }> => {
  return await httpClient('/api/v1/structor/dataset/m/getByCondition', filters);
};

export const getDatasetById = async (id: string): Promise<Dataset> => {
  const side = window.SIDE === 'home' ? 'home' : 'm';
  return await httpClient(`/api/v1/structor/dataset/${side}/get`, { id });
};

export const createDataset = async (dataset: Omit<Dataset, 'id' | 'content'>): Promise<{ id: string }> => {
  return await httpClient('/api/v1/structor/dataset/m/create', dataset);
};

export const updateDataset = async (dataset: Dataset): Promise<{ id?: string }> => {
  return await httpClient('/api/v1/structor/dataset/m/update', dataset);
};

export const deleteDataset = async (id: string): Promise<{ id?: string }> => {
  return await httpClient('/api/v1/structor/dataset/m/delete', { id });
};
