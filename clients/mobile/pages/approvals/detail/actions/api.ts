import httpClient from '@lib/http-client';
import { AttachFile } from '@m/pages/approvals/types';

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
