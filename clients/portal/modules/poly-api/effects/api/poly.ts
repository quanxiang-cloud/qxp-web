import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';

import httpClient from '@lib/http-client';

import { POLY } from './names';

export interface Input<I> {
  path: string;
  body?: I;
}

type QueryPolyInfoInput = Input<{
  page: number;
  pageSize: number;
  active: number;
}>;
type QueryPolyInfoResponse = undefined | POLY_API.POLY_INFO;
export function useQueryPolyInfo(
  input: QueryPolyInfoInput, options?: UseQueryOptions<QueryPolyInfoResponse, Error>,
): UseQueryResult<QueryPolyInfoResponse, Error> {
  return useQuery<QueryPolyInfoResponse, Error>(
    [POLY, input.path],
    (): Promise<QueryPolyInfoResponse> => {
      if (options?.enabled === false) {
        return Promise.resolve(undefined);
      }
      return httpClient<QueryPolyInfoResponse>(`/api/v1/polyapi/poly/query/${input.path}`);
    },
    options,
  );
}
