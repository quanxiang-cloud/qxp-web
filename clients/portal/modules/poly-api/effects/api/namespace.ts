import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from 'react-query';

import httpClient from '@lib/http-client';

import { NAMESPACE_ROW } from './names';

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
