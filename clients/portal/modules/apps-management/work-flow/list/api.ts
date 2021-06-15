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
