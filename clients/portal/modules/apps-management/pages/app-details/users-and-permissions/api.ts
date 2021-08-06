import httpClient from '@lib/http-client';

export const createPerGroup = (appID: string, data: RightsCreate) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/create`, data);
};

export const fetchRights = (appID: string) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getList`, {});
};

export const deleteRights = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/delete`, data);
};

export const movePerGroup = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/move`, data);
};

export const updatePerGroup = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/updateName`, data);
};

export const updatePerGroupUser = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/update`, data);
};

export const fetchOperatePer = (appID: string, perGroupID: string) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/operatePer/get`, { perGroupID });
};

export const saveOperatePer = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/operatePer/save`, data);
};

export const fetchDataAccessPer = (appID: string, perGroupID: string) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/dataAccessPer/get`, { perGroupID });
};

export const saveDataAccessPer = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/dataAccessPer/save`, data);
};

export const fetchFieldFilter = (appID: string, permissionGroupID: string) => {
  return httpClient(`/api/v1/structor/${appID}/m/filter/get`, { permissionGroupID });
};

export const saveFieldFilter = (appID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/m/filter/save`, data);
};

// 0.4

export const fetchPerGroupForm = (appID: string, perGroupID: string) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getForm`, { perGroupID });
};

type PerDataReq = {
  formID: string;
  perGroupID: string;
}

export const fetchPerData = (appID: string, data: PerDataReq) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/getPerData`, data);
};

type PerData = {
  formID: string;
  perGroupID: string;
  authority: number;
  schema: any;
  conditions: Condition[];
}

export const savePer = (appID: string, data: PerData) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/saveForm`, data);
};

export const deleteFormPer = (appID: string, data: PerDataReq) => {
  return httpClient(`/api/v1/structor/${appID}/m/permission/perGroup/deleteForm`, data);
};

