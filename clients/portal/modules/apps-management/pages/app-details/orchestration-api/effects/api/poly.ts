import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  UseMutationOptions,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

import httpClient from '@lib/http-client';

import { POLY, POLY_SEARCH } from './names';
import type { Input, NameSpace } from './api-namespace';

type QueryPolyApiListInput = Input<{
  page: number;
  pageSize: number;
  active: number;
}>;
export type PolyListItem = Omit<NameSpace, 'parent' | 'subCount'> & {
  fullPath: string;
  method: HTTPMethod;
}
type QueryPolyApiListResponse = undefined | {
  total: number;
  page: number;
  list: PolyListItem[];
};
export function useQueryPolyList(
  input: QueryPolyApiListInput, options?: UseQueryOptions<QueryPolyApiListResponse, Error>,
): UseQueryResult<QueryPolyApiListResponse, Error> {
  return useQuery<QueryPolyApiListResponse, Error>(
    [POLY, input.path, input.body?.page, input.body?.pageSize],
    (): Promise<QueryPolyApiListResponse> => {
      if (options?.enabled === false) {
        return Promise.resolve(undefined);
      }
      return httpClient<QueryPolyApiListResponse>(`/api/v1/polyapi/poly/list/${input.path}`, input.body);
    },
    options,
  );
}

function usePoly<I extends Input<any>, O>(
  options?: UseMutationOptions<O, Error, I>,
): UseMutationResult<O, Error, I> {
  const queryClient = useQueryClient();
  return useMutation<O, Error, I>(
    ({ path, body }: I): Promise<O> => httpClient<O, I>(`/api/v1/polyapi/poly/${path}`, body),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        const path = variables.path;
        const paths = path.split('/').slice(1, path.startsWith('active') ? -1 : undefined);
        queryClient.invalidateQueries([POLY, paths.join('/')]);
        queryClient.invalidateQueries([POLY_SEARCH, paths.join('/')]);
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
}

export type CreatePolyParams = Pick<PolyListItem, 'title' | 'name' | 'method'> & {
  templateAPIPath?: string;
  desc?: string;
}
export type CreatePolyInput = Input<CreatePolyParams>
export type CreatePolyResponse = Omit<
  PolyListItem,
  'title' | 'name' | 'desc' | 'parent' | 'subCount' | 'fullPath'
> & {
  apiPath: string;
  arrange: string;
}
export function useCreatePoly(
  options?: UseMutationOptions<CreatePolyResponse, Error, CreatePolyInput>,
): UseMutationResult<CreatePolyResponse, Error, CreatePolyInput> {
  return usePoly<CreatePolyInput, CreatePolyResponse>(options);
}

export type SearchPolyParams = {
  name?: string;
  title: string;
  active: number;
  page: number;
  pageSize: number;
  withSub: boolean;
}
export type SearchPolyInput = Input<SearchPolyParams>;
export type PolyListSearchItem = PolyListItem & {
  url: string;
  version: string;
  action: string;
};
export type SearchPolyResponse = undefined | {
  total: number;
  page: number;
  list: PolyListSearchItem[];
};
export function useSearchPoly(
  input: SearchPolyInput,
  options?: UseQueryOptions<SearchPolyResponse, Error>,
): UseQueryResult<SearchPolyResponse, Error> {
  return useQuery<SearchPolyResponse, Error>(
    [POLY_SEARCH, input.path, input.body?.page, input.body?.pageSize],
    (): Promise<SearchPolyResponse> => {
      if (options?.enabled === false) {
        return Promise.resolve(undefined);
      }
      return httpClient<SearchPolyResponse>(`/api/v1/polyapi/poly/search/${input.path}`, input.body);
    },
    options,
  );
}

export type ActivePolyParams = { active: number };
export type ActivePolyInput = Input<ActivePolyParams>;
export type ActivePolyResponse = {
  fullPath: string;
  active: number;
};
export function useActivePoly(
  options?: UseMutationOptions<ActivePolyResponse, Error, ActivePolyInput>,
): UseMutationResult<ActivePolyResponse, Error, ActivePolyInput> {
  return usePoly<ActivePolyInput, ActivePolyResponse>(options);
}

export type RemovePolyParams = { names: string []};
export type RemovePolyInput = Input<RemovePolyParams>;
export type RemovePolyResponse = { apiPath: string[] };
export function useRemovePoly(
  options?: UseMutationOptions<RemovePolyResponse, Error, RemovePolyInput>,
): UseMutationResult<RemovePolyResponse, Error, RemovePolyInput> {
  return usePoly<RemovePolyInput, RemovePolyResponse>(options);
}
