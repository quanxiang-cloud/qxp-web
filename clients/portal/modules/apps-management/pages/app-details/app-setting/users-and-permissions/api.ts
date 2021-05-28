import request from '@portal/modules/apps-management/lib/request';
import httpClient from '@lib/http-client';

export const createPerGroup = (appID: string, data: RightsCreate) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/perGroup/create`,
    method: 'post',
    data,
  });
};

export const fetchRights = (appID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/perGroup/getList`,
    method: 'post',
  });
};

export const deleteRights = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/perGroup/delete`,
    method: 'post',
    data,
  });
};

export const movePerGroup = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/perGroup/move`,
    method: 'post',
    data,
  });
};

export const updatePerGroup = (appID: string, data: Rights) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/perGroup/update`,
    method: 'post',
    data,
  });
};

export const fetchOperatePer = (appID: string, perGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/operatePer/get`,
    method: 'post',
    data: { perGroupID },
  });
};

export const saveOperatePer = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/operatePer/save`,
    method: 'post',
    data,
  });
};

export const fetchDataAccessPer = (appID: string, perGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/dataAccessPer/get`,
    method: 'post',
    data: { perGroupID },
  });
};

export const saveDataAccessPer = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/permission/dataAccessPer/save`,
    method: 'post',
    data,
  });
};

export const fetchFieldFilter = (appID: string, permissionGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/filter/get`,
    method: 'post',
    data: { permissionGroupID },
  });
};

export const saveFieldFilter = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/filter/save`,
    method: 'post',
    data,
  });
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

