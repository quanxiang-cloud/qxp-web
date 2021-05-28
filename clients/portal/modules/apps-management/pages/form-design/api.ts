import request from '@portal/modules/apps-management/lib/request';

export const createFormScheme = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/table/create`,
    method: 'post',
    data,
  });
};

export const fetchFormScheme = (appID: string, tableID: string) => {
  return request({
    url: `/api/v1/structor/${appID}/m/table/getByID`,
    method: 'post',
    data: { tableID },
  });
};

export const updateFormScheme = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/table/update`,
    method: 'post',
    data,
  });
};

export const createPageScheme = (appID: string, data: any) => {
  return request({
    url: `/api/v1/structor/${appID}/m/config/create`,
    method: 'post',
    data,
  });
};

