import httpClient from '@lib/http-client';
import { httpPost } from '@lib/utils';

type GetFlowsParams = {
  appId: string;
  page: number;
  size: number;
  triggerMode?: string;
}
export function getFlowList(params: GetFlowsParams): Promise<{ dataList: Flow[], total: number; }> {
  return httpClient('/api/v1/flow/flowList', params);
}

export async function deleteFlow(flowId: string) {
  const { data } = await httpPost<any>(`/api/v1/flow/deleteFlow/${flowId}`, JSON.stringify({}));
  return data;
}
