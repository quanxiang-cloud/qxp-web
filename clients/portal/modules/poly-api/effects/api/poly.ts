import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';

import httpClient from '@lib/http-client';

import { POLY, POLY_QUERY } from './names';

interface QueryPolyInfoInput<I = any> {
  path: string;
  body?: I;
}

type QueryPolyInfoResponse = undefined | POLY_API.POLY_INFO & { arrange: string };
export function useQueryPolyInfo(
  input: QueryPolyInfoInput, options?: UseQueryOptions<QueryPolyInfoResponse, Error>,
): UseQueryResult<QueryPolyInfoResponse, Error> {
  return useQuery<QueryPolyInfoResponse, Error>(
    [POLY, POLY_QUERY, input.path],
    (): Promise<QueryPolyInfoResponse> => {
      if (options?.enabled === false) {
        return Promise.resolve(undefined);
      }
      return httpClient<QueryPolyInfoResponse>(`/api/v1/polyapi/poly/query/${input.path}`, {});
    },
    options,
  );
}
