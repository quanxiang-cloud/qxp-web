import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from 'react-query';

import httpClient from '@lib/http-client';

import { GET_NAMESPACE_FULL_PATH, NAMESPACE_ROW } from './names';

export interface Input<I> {
  path: string;
  body?: I;
}

type QueryRootPathInput = string;
type QueryRootPathResponse = {
  appID: string;
  pathType: string;
  appPath: string;
};
export function useQueryNameSpaceRawRootPath(
  appID: QueryRootPathInput,
  options?: UseQueryOptions<QueryRootPathResponse, Error>,
): UseQueryResult<QueryRootPathResponse, Error> {
  return useQuery<QueryRootPathResponse, Error>(
    [NAMESPACE_ROW, appID],
    () => httpClient('/api/v1/polyapi/namespace/appPath', { pathType: 'root', appID }),
    options,
  );
}

type QueryNamespaceFullPathInputBody = {
  active: number;
}
type QueryNamespaceFullPathInput = Input<QueryNamespaceFullPathInputBody>;
type QueryNamespaceFullPathResponse = any

export function useGetNamespaceFullPath(
  input: QueryNamespaceFullPathInput, options?: UseQueryOptions<QueryNamespaceFullPathResponse, Error>,
): UseQueryResult<QueryNamespaceFullPathResponse, Error> {
  return useQuery<QueryNamespaceFullPathResponse, Error>(
    [GET_NAMESPACE_FULL_PATH, input.path],
    (): Promise<QueryNamespaceFullPathResponse> => {
      return httpClient<QueryNamespaceFullPathResponse>(
        `/api/v1/polyapi/namespace/tree/${input.path}`, input.body,
      );
    },
    options,
  );
}
