import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

import httpClient from '@lib/http-client';

import { GET_REQUEST_NODE_API_LIST } from './names';

export interface Input<I> {
  path: string;
  body?: I;
}

interface QueryPolyApiListItem {
  name: string;
  path: string;
  children: QueryPolyApiListItem[];
}

type QueryRequestNodeApiListInput = Input<{
  appID: string
}>
type QueryRequestNodeApiListResponse = undefined | QueryPolyApiListItem[];

export function useGetRequestNodeApiList(
  input: QueryRequestNodeApiListInput, options?: UseQueryOptions<QueryRequestNodeApiListResponse, Error>,
): UseQueryResult<QueryRequestNodeApiListResponse, Error> {
  return useQuery<QueryRequestNodeApiListResponse, Error>(
    [GET_REQUEST_NODE_API_LIST],
    (): Promise<QueryRequestNodeApiListResponse> => {
      return httpClient<QueryRequestNodeApiListResponse>(
        `/api/v1/polyapi/poly/list/${input.path}`, input.body,
      );
    },
    options,
  );
}
