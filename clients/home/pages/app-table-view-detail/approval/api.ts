import httpClient from '@lib/http-client';

export const getApproveProcess = (dataID: string) => {
  // return httpClient<any>(`/api/v1/flow/approve/process/${dataID}`);
  return httpClient<any>('/api/v1/examine/getByTaskID', { taskID: dataID });
};

// 获取审批动态 taskID
export const getPipelineApproveProcess = (dataID: string) => {
  return httpClient<any>('/api/v1/examine/getByDataID', { dataID });
};

// 获取填写动态 taskID
export const getPipelineFillInProcess = (dataID: string) => {
  return httpClient<any>('/api/v1/fill/getByDataID', { dataID });
};

// 获取全部动态 taskID
export const getAllProcess = (dataID: string) => {
  const arr: any = [getPipelineApproveProcess, getPipelineFillInProcess];
  return Promise.all(arr.map((item: any)=>item(dataID)));
};

