import httpClient from '@lib/http-client';
import { AttachFile } from '@m/pages/new-approvals/types';

type StepBack = {
  taskDefKey: string,
  taskName: string,
}

// 同意
export const pipelineAgree = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/agree', data);
};

// 拒绝
export const pipelineReject = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/reject', data);
};

// 撤回
export const pipelineRecall = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/recall', { taskID: data });
};

// 催办
export const pipelineUrge = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/urge', { taskID: data });
};

// 提交填写
export const submitPipelineFillTask = async ( params: { id: string; forMData: any, [key: string]: any }): Promise<{ data: any }> => {
  return await httpClient('/api/v1/fill/fill', params);
};

export function reviewTask(
  handleType: string,
  processInstanceId: string,
  taskId: string,
  remark?: string,
  formData?: any,
  attachFiles?: AttachFile[],
): Promise<void> {
  const params = { handleType, formData, remark, attachFiles };
  return httpClient(`/api/v1/flow/instance/reviewTask/${processInstanceId}/${taskId}`, params);
}

export function resubmit(processInstanceId: string, formData?: any): Promise<void> {
  return httpClient(`/api/v1/flow/instance/resubmit/${processInstanceId}`, { formData });
}

export function readHandle(processInstanceId: string, taskId: string, remark: string): Promise<void> {
  return httpClient(`/api/v1/flow/instance/handleRead/${processInstanceId}/${taskId}`, { remark });
}

export function ccFlow(
  handleType: string,
  processInstanceId: string,
  taskId: string,
  remark: string,
  handleUserIds: Array<string>,
): Promise<void> {
  const params = { handleType, remark, handleUserIds };
  return httpClient(`/api/v1/flow/instance/ccFlow/${processInstanceId}/${taskId}`, params);
}

export function stepBack(
  handleType: string,
  processInstanceId: string,
  taskId: string,
  remark: string,
  taskDefKey: string,
): Promise<void> {
  const params = { handleType, remark, taskDefKey };
  return httpClient(`/api/v1/flow/instance/stepBack/${processInstanceId}/${taskId}`, params);
}

export function sendBack(
  handleType: string,
  processInstanceId: string,
  taskId: string,
  remark: string,
  attachFiles?: AttachFile[],
): Promise<void> {
  const params = { handleType, remark, attachFiles };
  return httpClient(`/api/v1/flow/instance/sendBack/${processInstanceId}/${taskId}`, params);
}

export function inviteReadHandle(
  handleType: string,
  processInstanceId: string,
  taskId: string,
  remark: string,
  handleUserIds: Array<string>,
): Promise<void> {
  const params = { handleType, remark, handleUserIds };
  return httpClient(`/api/v1/flow/instance/readFlow/${processInstanceId}/${taskId}`, params);
}

export function deliver(
  handleType: string,
  processInstanceId: string,
  taskId: string,
  remark: string,
  handleUserIds: Array<string>,
  formData?: any,
): Promise<void> {
  const params = { handleType, remark, handleUserIds, formData };
  return httpClient(`/api/v1/flow/instance/deliverTask/${processInstanceId}/${taskId}`, params);
}

export function addSign(
  processInstanceId: string,
  taskId: string,
  assignee: Array<{ id: string; }>,
  multiplePersonWay: 'and' | 'or' | string,
  type: 'BEFORE' | 'AFTER' | string,
): Promise<void> {
  const params = { assignee, multiplePersonWay, type };
  return httpClient(`/api/v1/flow/instance/addSign/${processInstanceId}/${taskId}`, params);
}

export function handleCc(taskId: string): Promise<void> {
  return httpClient('/api/v1/flow/instance/handleCc', [taskId]);
}

export function getStepBackActivityList(
  processInstanceId: string,
): Promise<Array<StepBack>> {
  return httpClient(`/api/v1/flow/instance/stepBackActivityList/${processInstanceId}`);
}
