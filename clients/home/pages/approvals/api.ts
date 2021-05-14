// flow instance apis
import httpClient from '@lib/http-client';

// 分页查询我的待处理任务
export const getWaitReviewList = async (params: Record<string, any>)
  : Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/waitReviewList', params);
};

// 分页查询我已处理的任务
export const getMyReviewedList = async (params: Record<string, any>)
  : Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/reviewedList', params);
};

// 分页查询我申请的流程
export const getMyApplyList = async (params: Record<string, any>)
  : Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/myApplyList', params);
};

// 分页查询抄送给我的流程
export const getCCToMeList = async (params: Record<string, any>)
  : Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/ccToMeList', params);
};

// 分页查询全部流程
export const getAllTaskList = async (params: Record<string, any>)
  : Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/allList', params);
};

// 获取流程实例数量
export const getFlowInstanceCount = async (params: Record<string, any>)
  : Promise<{ overTimeCount?: number, urgeCount?: number, waitHandleCount?: number, ccToMeCount?: number }> => {
  return await httpClient('/api/v1/flow/instance/getFlowInstanceCount', params);
};

// 获取阻塞的流程列表
export const getBlockList = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/getBlockList', params);
};

// 获取任务的表单权限
export const getTaskFormPermission = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/getTaskFormPermission/{processInstanceId}/{taskId}', params);
};

// 阅示
export const readFlow = async (processInstanceId: string, taskId: string, params: Record<string, any>) => {
  return await httpClient(`/api/v1/flow/instance/readFlow/${processInstanceId}/${taskId}`, params);
};

// 抄送
export const ccFLow = async (processInstanceId: string, taskId: string, params: Record<string, any>) => {
  return await httpClient(`/api/v1/flow/instance/ccFlow/${processInstanceId}/${taskId}`, params);
};

// 启动流程
export const startFLow = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/startFlow', params);
};

// 抄送/阅示处理
export const handleRelatedFlow = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/handleCorrelationFlow/{id}', params);
};

// 启动单个流程
export const startFlowById = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/startFlow/{flowId}', params);
};

// 退回某步
export const stepBack = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/stepBack/{processInstanceId}/{taskId}', params);
};

// 任务审核（通过任务）
export const reviewTask = async (processInstanceId: string, taskId: string, params: { handleType: string; remark: any })
  : Promise<{ data: any }> => {
  return await httpClient(`/api/v1/flow/instance/reviewTask/${processInstanceId}/${taskId}`, params);
};

// 加签
export const signTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/addSign/{taskId}', params);
};

// 获取任务的表单
export const getTaskFormById = async (processInstanceID: string, taskID: string): Promise<TaskForm> => {
  return await httpClient(`/api/v1/flow/instance/getTaskForm/${processInstanceID}/${taskID}`);
};

// 流程任务审核
export const reviewFlowTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/reviewFlowTask/{processInstanceId}/{taskId}', params);
};

// 委托任务
export const entrustTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/entrustTask/{processInstanceId}/{taskId}', params);
};

// 领取任务
export const claimTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/claimTask/{processInstanceId}/{taskId}', params);
};

// 流程处理记录
export const getProcessHistory = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/processHistories/{processInstanceId}', params);
};

// 打回重填
export const sendBack = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/sendBack/{processInstanceId}/{taskId}', params);
};

// 全部已读
export const readAll = async (params: string[]) => {
  return await httpClient('/api/v1/flow/instance/handleCc', params);
};
