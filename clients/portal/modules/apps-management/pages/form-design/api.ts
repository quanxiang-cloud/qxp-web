import httpClient from '@lib/http-client';

export const createFormScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/table/create`, data);
};

export const fetchFormScheme = async (appID: string, tableID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/table/getByID`, { tableID });
};

export const updateFormScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/table/update`, data);
};

export const createPageScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/config/create`, data);
};

