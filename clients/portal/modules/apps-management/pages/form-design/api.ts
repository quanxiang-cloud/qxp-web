import httpClient from '@lib/http-client';

export const createFormScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/table/create`, data);
};

export const fetchFormScheme = async (appID: string, tableID: string) => {
  return await httpClient(`/api/v1/form/${appID}/m/table/getByID`, { tableID });
};

export const updateFormScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/form/${appID}/m/table/update`, data);
};

export const createPageScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/config/create`, data);
};

export const createPerGroup = async (appID: string, data: RightsCreate) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/create`, data);
};

export const fetchRights = async (appID: string, formID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getList`, { formID });
};

export const deleteRights = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/delete`, data);
};

export const movePerGroup = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/move`, data);
};

export const updatePerGroup = async (appID: string, data: Rights) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/update`, data);
};

export const fetchOperatePer = async (appID: string, perGroupID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/operatePer/get`, { perGroupID });
};

export const saveOperatePer = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/operatePer/save`, data);
};

export const fetchDataAccessPer = async (appID: string, perGroupID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/dataAccessPer/get`, {
    perGroupID,
  });
};

export const saveDataAccessPer = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/dataAccessPer/save`, data);
};

export const fetchFieldFilter = async (appID: string, permissionGroupID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/filter/get`, { permissionGroupID });
};

export const saveFieldFilter = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/filter/save`, data);
};

