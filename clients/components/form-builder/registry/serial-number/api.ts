import httpClient from '@lib/http-client';

export const getSerial = (appID: string, fieldID: string): Promise<{ code: number, data: any }> => {
  return httpClient(
    `/api/v1/form/${appID}/home/table/getSerial`,
    { fieldID },
  );
};
