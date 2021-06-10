import httpClient from '@lib/http-client';

type GetFlowsParams = {
  appId: string;
  page: number;
  size: number;
  triggerMode?: string;
}
export function getFlowList(params: GetFlowsParams): Promise<{ dataList: Flow[], total: number; }> {
  return httpClient('/api/v1/flow/flowList', params);
}

export function deleteFlow(flowId: string) {
  return httpClient<any>(`/api/v1/flow/deleteFlow/${flowId}`);
}
