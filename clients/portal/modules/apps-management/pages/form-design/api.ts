import httpClient from '@lib/http-client';

export const createPageScheme = async (appID: string, data: any) => {
  return await httpClient(`/api/v1/structor/${appID}/m/config/create`, data);
};

