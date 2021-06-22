import httpClient from '@lib/http-client';

type TaskParams = {
  processInstanceId: string,
  taskId: string
}

export const getAbnormalTask = async (params?: Record<string, unknown>)
  : Promise<{ dataList: UnusualTaskItem[], total: number }> => {
  return await httpClient('/api/v1/flow/abnormalTask/list', params);
};

export const getAbnormalTaskForm = async (params: TaskParams)
  : Promise<any> => {
  return await httpClient(
    `/api/v1/flow/abnormalTask/adminGetTaskForm/${params.processInstanceId}/${params.taskId}`,
    params);
};

export const abandonTask = async (params: TaskParams)
  : Promise<any> => {
  return await httpClient(
    `/api/v1/flow/abnormalTask/adminAbandon/${params.processInstanceId}/${params.taskId}`,
  );
};

export const deliverTask = async (params: TaskParams, body: { handleType: string, handleUserIds: string[]})
  : Promise<any> => {
  return await httpClient(
    `/api/v1/flow/abnormalTask/adminDeliverTask/${params.processInstanceId}/${params.taskId}`,
    body,
  );
};

export const stepTask = async (params: TaskParams, body: {activityInstanceId: string, remark: string})
  : Promise<any> => {
  return await httpClient(
    `/api/v1/flow/abnormalTask/adminStepBack/${params.processInstanceId}/${params.taskId}`,
    body);
};

export const sendTask = async (params: TaskParams, body: { remark: string})
  : Promise<any> => {
  return await httpClient(
    `/api/v1/flow/abnormalTask/adminSendBack/${params.processInstanceId}/${params.taskId}`,
    body);
};

// 获取可回退的节点列表
export const getStepbackActivityList = async (processInstanceId: string): Promise<any> => {
  return await httpClient(`/api/v1/flow/instance/stepBackActivityList/${processInstanceId}`);
};
