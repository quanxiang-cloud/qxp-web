import httpClient from '@lib/http-client';

export const getAbnormalTask = async (params?: Record<string, unknown>)
  : Promise<{ dataList: UnusualTaskItem[], total: number }> => {
  return await httpClient('/api/v1/flow/abnormalTask/list', params);
};

// export const abandonTask = async (params?: Record<string, unknown>)
//   : Promise<{ dataList: UnusualTaskItem[], total: number }> => {
//   return await httpClient(`/api/v1/flow/abnormalTask/adminAbandon/${processInstanceId}/${taskId}`, params);
// };

// export const deliverTask = async (params?: Record<string, unknown>)
//   : Promise<{ dataList: UnusualTaskItem[], total: number }> => {
//   return await httpClient(`/api/v1/flow/abnormalTask/adminDeliverTask/${processInstanceId}/${taskId}`,
//     params);
// };

// export const stepTask = async (params?: Record<string, unknown>)
//   : Promise<{ dataList: UnusualTaskItem[], total: number }> => {
//   return await httpClient(`/api/v1/flow/abnormalTask/adminStepBack/${processInstanceId}/${taskId}`,
//     params);
// };

// export const sendTask = async (params?: Record<string, unknown>)
//   : Promise<{ dataList: UnusualTaskItem[], total: number }> => {
//   return await httpClient(`/api/v1/flow/abnormalTask/adminSendBack/${processInstanceId}/${taskId}`,
//     params);
// };
