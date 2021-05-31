import httpClient from '@lib/http-client';

export const createPerGroup = async (appID: string, data: RightsCreate) => {
  return await await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/create`, data);
};

export const fetchRights = async (appID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getList`, {});
};

export const deleteRights = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/delete`, data);
};

export const movePerGroup = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/move`, data);
};

export const updatePerGroup = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/update`, data);
};

export const fetchOperatePer = async (appID: string, perGroupID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/operatePer/get`, { perGroupID });
};

export const saveOperatePer = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/operatePer/save`, data);
};

export const fetchDataAccessPer = async (appID: string, perGroupID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/dataAccessPer/get`, { perGroupID });
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

// 0.4

export const fetchPerGroupForm = async (appID: string, perGroupID: string) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getForm`, { perGroupID });
};

type PerDataReq = {
  formID: string;
  perGroupID: string;
}

export const fetchPerData = async (appID: string, data: PerDataReq) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getPerData`, data);
};

type PerData = {
  formID: string;
  perGroupID: string;
  authority: number;
  schema: any;
  conditions: Condition[];
}

export const savePer = async (appID: string, data: PerData) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/saveForm`, data);
};

export const deleteFormPer = async (appID: string, data: PerDataReq) => {
  return await httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/deleteForm`, data);
};

