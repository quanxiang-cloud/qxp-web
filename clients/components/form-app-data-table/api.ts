import httpClient from '@lib/http-client';

export const formDataCurd = (appID: string, tableID: string, data: any) => {
  return httpClient(`/api/v1/structor/${appID}/home/form/${tableID}`, data);
};
