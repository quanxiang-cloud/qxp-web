import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';

import httpClient from '@lib/http-client';

import { POLY, POLY_QUERY, POLY_REQUEST } from './names';

export interface Input<I = any> {
  path: string;
  body?: I;
}

type QueryPolyInfoInput = Input;
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
      return httpClient<QueryPolyInfoResponse>(`/api/v1/polyapi/poly/query/${input.path}`);
    },
    options,
  );
}

type useBuildPolyInput = Input<{
  docType: number;
  titleFirst?: boolean;
}>;
type useBuildPolyResponse = undefined | any;
export function usePolyBuild(
  input: useBuildPolyInput, options?: UseQueryOptions<useBuildPolyResponse, Error>,
): UseQueryResult<useBuildPolyResponse, Error> {
  return useQuery<useBuildPolyResponse, Error>(
    [POLY, POLY_REQUEST, input.path],
    (): Promise<useBuildPolyResponse> => {
      if (options?.enabled === false) {
        return Promise.resolve(undefined);
      }
      return httpClient<useBuildPolyResponse>(`/api/v1/polyapi/poly/request/${input.path}`, input.body);
    },
    options,
  );
}
