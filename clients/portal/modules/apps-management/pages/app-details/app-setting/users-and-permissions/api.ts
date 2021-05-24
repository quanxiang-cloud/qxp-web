import request from '@portal/modules/apps-management/lib/request';

export const createPerGroup = (appID: string, data: RightsCreate) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/create`,
    method: 'post',
    data,
  });
};

export const fetchRights = (appID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/getList`,
    method: 'post',
  });
};

export const deleteRights = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/delete`,
    method: 'post',
    data,
  });
};

export const movePerGroup = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/move`,
    method: 'post',
    data,
  });
};

export const updatePerGroup = (appID: string, data: Rights) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/perGroup/update`,
    method: 'post',
    data,
  });
};

export const fetchOperatePer = (appID: string, perGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/operatePer/get`,
    method: 'post',
    data: { perGroupID },
  });
};

export const saveOperatePer = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/operatePer/save`,
    method: 'post',
    data,
  });
};

export const fetchDataAccessPer = (appID: string, perGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/dataAccessPer/get`,
    method: 'post',
    data: { perGroupID },
  });
};

export const saveDataAccessPer = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/permission/dataAccessPer/save`,
    method: 'post',
    data,
  });
};

export const fetchFieldFilter = (appID: string, permissionGroupID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/filter/get`,
    method: 'post',
    data: { permissionGroupID },
  });
};

export const saveFieldFilter = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/filter/save`,
    method: 'post',
    data,
  });
};
