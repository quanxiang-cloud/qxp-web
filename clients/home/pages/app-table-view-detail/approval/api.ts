import httpClient from '@lib/http-client';

export const getApproveProcess = (dataID: string) => {
  return httpClient<any>(`/api/v1/flow/approve/process/${dataID}`);
};
