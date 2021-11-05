import httpClient from '@lib/http-client';

import { FuncListParams } from 'clients/types/faas';

export function fetchFuncList(
  groupID: string,
  params: FuncListParams,
): Promise<void> {
  return httpClient(`/api/v1/faas/group/${groupID}/list`, params);
}
