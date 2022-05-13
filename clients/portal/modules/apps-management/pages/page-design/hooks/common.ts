import { useMemo } from 'react';
import { UseQueryOptions, UseQueryResult, useQuery, QueryKey } from 'react-query';
import { omit } from 'ramda';

import httpClient from '@lib/http-client';

export interface Input<I> {
  path?: string;
  body?: I;
}

export type AbstractQueryOptions<I, O> = UseQueryOptions<O, Error> & {
  getQueryKey: (input: Input<I>) => QueryKey;
  queryFunction?: () => Promise<O | undefined>;
}

type QueryReturn<O> = Promise<O | undefined | never>;
function getQuery<I, O>(
  input: Input<I>, options: AbstractQueryOptions<I, O | undefined>,
): () => QueryReturn<O> {
  return (): QueryReturn<O> => {
    const { enabled, queryFunction } = options;
    if (enabled === false) {
      return Promise.resolve(undefined);
    }
    if (queryFunction) {
      return queryFunction();
    }
    const { path, body } = input;
    if (path) {
      return httpClient<O>(path, body);
    }
    if (!queryFunction && !path) {
      const error = new Error('please provide either queryFunction or path');
      return Promise.reject(error);
    }
    return Promise.resolve(undefined);
  };
}

export type UseAbstractQueryReturn<O> = UseQueryResult<O | undefined, Error>;
export function useAbstractQuery<I, O>(
  input: Input<I>, options: AbstractQueryOptions<I, O | undefined>,
): UseAbstractQueryReturn<O> {
  const { getQueryKey, ...opts } = options;
  const queryKey = getQueryKey(input);
  const query = useMemo(() => getQuery(input, options), [input, options]);

  return useQuery<O | undefined, Error>(queryKey, query, omit(['queryFunction'], opts));
}
