import { QueryFunctionContext } from 'react-query';

import { httpPost } from '@lib/utils';

export async function getFlowList({ queryKey }: QueryFunctionContext) {
  const pagination = {
    page: (queryKey[2] as Pagination).current,
    size: (queryKey[2] as Pagination).pageSize,
  };
  const { data } = await httpPost<{
    dataList: Flow[];
    total: number;
  }>('/api/v1/flow/flowList', queryKey[1] ? JSON.stringify({
    triggerMode: queryKey[1],
    ...pagination,
  }) : JSON.stringify(pagination));

  return data;
}

export async function deleteFlow(flowId: string) {
  const { data } = await httpPost<any>(`/api/v1/flow/deleteFlow/${flowId}`, JSON.stringify({}));
  return data;
}
