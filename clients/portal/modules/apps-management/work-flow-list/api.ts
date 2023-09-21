import httpClient from '@lib/http-client';

type GetFlowsParams = {
  appId: string;
  page: number;
  size: number;
  triggerMode?: TriggerMode;
}
export function getFlowList(params: GetFlowsParams): Promise<{ dataList: Flow[], total: number; }> {
  return httpClient('/api/v1/flow/flowList', params);
}

export function deleteFlow(flowId: string): Promise<any> {
  return httpClient<any>(`/api/v1/flow/deleteFlow/${flowId}`);
}

// 获取流程列表
export function getPipelineFlowList(params: GetFlowsParams): Promise<{ dataList: Flow[], total: number; }> {
  return httpClient.get('/api/v1/pipelines', { appID: params?.appId });
}

// 删除流程
export function deletePipelineFlow(flowId: string): Promise<any> {
  return httpClient.delete(`/api/v1/pipeline/${flowId}`);
}
