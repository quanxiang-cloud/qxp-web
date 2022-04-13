import {
  useMutation,
  UseMutationResult,
  UseQueryResult,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  useQueryClient,
} from 'react-query';

import httpClient from '@lib/http-client';

import { NAMESPACES, ROOTPATH, NAMESPACES_SEARCH } from './names';
import { initAppPath } from '@portal/modules/apps-management/pages/app-details/api';

export interface Input<I> {
  path: string;
  body?: I;
}

function useNameSpace<I extends Input<any>, O>(
  options?: UseMutationOptions<O, Error, I>,
): UseMutationResult<O, Error, I> {
  const queryClient = useQueryClient();
  return useMutation<O, Error, I>(
    ({ path, body }: I) => httpClient<O>(`/api/v1/polyapi/namespace/${path}`, body),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        const path = variables.path;
        const paths = path.split('/').slice(1, path.startsWith('delete') ? -1 : undefined);
        queryClient.invalidateQueries([NAMESPACES, paths.join('/')]);
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
}

export type CreateParams = {
  name: string;
  title: string;
  desc?: string;
};
export type CreateInput = Input<CreateParams>;
export interface CreateResponse {
  total: number;
  page: number;
  list: PolyAPI.Namespace[];
}
export function useCreateNameSpace(
  options?: UseMutationOptions<CreateResponse, Error, CreateInput>,
): UseMutationResult<CreateResponse, Error, CreateInput> {
  return useNameSpace<CreateInput, CreateResponse>(options);
}

export type DeleteInput = Input<undefined>;
export interface DeleteResponse {
  data?: {
    fullPath: string;
  }
}
export function useDeleteNameSpace(
  options?: UseMutationOptions<DeleteResponse, Error, DeleteInput>,
): UseMutationResult<DeleteResponse, Error, DeleteInput> {
  return useNameSpace<DeleteInput, DeleteResponse>(options);
}

export type UpdateParams = Pick<CreateParams, 'desc' | 'title'>;
export type UpdateInput = Input<UpdateParams>;
export type UpdateResponse = DeleteResponse;
export function useUpdateNameSpace(
  options?: UseMutationOptions<UpdateResponse, Error, UpdateInput>,
): UseMutationResult<UpdateResponse, Error, UpdateInput> {
  return useNameSpace<UpdateInput, UpdateResponse>(options);
}

type QueryListInput = string;
type QueryListResponse = CreateResponse;
export function useQueryNameSpaceList(
  path: QueryListInput, appID: string, options?: UseQueryOptions<QueryListResponse | void, Error>,
): UseQueryResult<QueryListResponse | void, Error> {
  return useQuery<QueryListResponse | void, Error>(
    [NAMESPACES, path],
    () => {
      try {
        return getNameSpaceList(path);
      } catch (error) {
        return initAppPath(appID);
      }
    },
    options,
  );
}
export function getNameSpaceList(path: string, active?: number): Promise<CreateResponse> {
  return httpClient(`/api/v1/polyapi/namespace/list/${path}`, { pageSize: -1, active: active || -1 });
}

type SearchListInput = Input<{ title: string }>;
type SearchListResponse = CreateResponse;
export function useSearchNameSpaceList(
  input: SearchListInput, options?: UseQueryOptions<SearchListResponse, Error>,
): UseQueryResult<SearchListResponse, Error> {
  return useQuery<SearchListResponse, Error>(
    [NAMESPACES, NAMESPACES_SEARCH, input.path, input.body?.title],
    () => searchNamespaceList(input.path, input.body?.title),
    options,
  );
}
function searchNamespaceList(path: string, title?: string): Promise<CreateResponse> {
  return httpClient(`/api/v1/polyapi/namespace/search/${path}`, {
    active: -1, page: 1, pageSize: -1, withSub: true, title,
  });
}

type QueryRootPathInput = string;
type QueryRootPathResponse = {
  appID: string;
  pathType: string;
  appPath: string;
};
export function useQueryNameSpaceRootPath(
  appID: QueryRootPathInput,
  options?: UseQueryOptions<QueryRootPathResponse, Error>,
): UseQueryResult<QueryRootPathResponse, Error> {
  return useQuery<QueryRootPathResponse, Error>(
    [ROOTPATH, appID],
    () => httpClient('/api/v1/polyapi/namespace/appPath', { pathType: 'poly', appID }),
    options,
  );
}
