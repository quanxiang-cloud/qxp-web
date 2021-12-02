import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

import httpClient from '@lib/http-client';

import { GET_REQUEST_NODE_API_LIST } from './names';

export interface Input<I> {
  path: string;
  body?: I;
}

export type RawApiDetail = {
  id: string,
  owner: string,
  ownerName: string,
  name: string,
  title: string,
  desc: string,
  fullPath: string,
  url: string,
  version: string,
  method: string,
  action: string,
  creatAt: string,
}

type QueryRequestNodeApiListInputBody = {
  name?: string;
  title?: string;
  active?: number;
  page?: number;
  pageSize?: number;
  withSub?: boolean;
}
type QueryRequestNodeApiListInput = Input<QueryRequestNodeApiListInputBody>;
type QueryRequestNodeApiListResponse = {
  list: RawApiDetail[];
  page: number;
  total: number;
}

export function useGetRequestNodeApiList(
  input: QueryRequestNodeApiListInput, options?: UseQueryOptions<QueryRequestNodeApiListResponse, Error>,
): UseQueryResult<QueryRequestNodeApiListResponse, Error> {
  return useQuery<QueryRequestNodeApiListResponse, Error>(
    [GET_REQUEST_NODE_API_LIST, input.path],
    (): Promise<QueryRequestNodeApiListResponse> => {
      return httpClient<QueryRequestNodeApiListResponse>(
        `/api/v1/polyapi/raw/search/${input.path}`, input.body,
      );
    },
    options,
  );
}

export type RawApiDocDetail = {
  docType: string;
  name: string;
  id: string;
  doc: {
    url: string;
    input: {
      inputs: POLY_API.PolyNodeInput[];
    };
    output: {
      doc: [{
        type: 'object';
        data: POLY_API.PolyNodeInput[];
        in: 'body';
      }]
    }
  };
  apiPath: string;
}

type QueryRequestNodeApiInputBody = {
  docType: 'raw' | 'swag' | 'curl' | 'javascript' | 'python'
  titleFirst?: boolean,
  _hide?: any,
  _signature?: any,
}
type QueryRequestNodeApiInput = Input<QueryRequestNodeApiInputBody>;
type QueryRequestNodeApiResponse = RawApiDocDetail

export function useGetRequestNodeApi(
  input: QueryRequestNodeApiInput, options?: UseQueryOptions<QueryRequestNodeApiResponse, Error>,
): UseQueryResult<QueryRequestNodeApiResponse, Error> {
  return useQuery<QueryRequestNodeApiResponse, Error>(
    [GET_REQUEST_NODE_API_LIST, input.path],
    (): Promise<QueryRequestNodeApiResponse> => {
      return httpClient<QueryRequestNodeApiResponse>(
        `/api/v1/polyapi/raw/doc/${input.path}`, input.body,
      );
    },
    options,
  );
}
