import { TableConfig } from '@c/form-app-data-table/type';
import httpClient from '@lib/http-client';

type createPageSchemeParam = {
  tableID: string;
  config: {
    pageTableColumns: string[];
    filters: Filters;
    pageTableShowRule: TableConfig;
  },
}

export const fetchFormScheme = async <T>(appID: string, tableID: string): Promise<T> => {
  return await httpClient<T>(`/api/v1/form/${appID}/m/table/getByID`, { tableID });
};

export const createPageScheme = async <T>(appID: string, data: createPageSchemeParam): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/config/create`, data);
};

export const createPerGroup = async <T>(appID: string, data: RightsCreate): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/permission/perGroup/create`, data);
};

export const fetchRights = async <T>(appID: string, formID: string): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/permission/perGroup/getList`, { formID });
};

export const deleteRights = async <T>(appID: string, data: any): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/permission/perGroup/delete`, data);
};

export const movePerGroup = async <T>(appID: string, data: any): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/permission/perGroup/move`, data);
};

export const updatePerGroup = async <T>(appID: string, data: Rights): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/permission/perGroup/update`, data);
};

