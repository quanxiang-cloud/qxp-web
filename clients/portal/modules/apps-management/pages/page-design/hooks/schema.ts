import { UseQueryOptions } from 'react-query';
import { Artery } from '@one-for-all/artery';

import { parseJSON } from '@lib/utils';

import { useAbstractQuery, UseAbstractQueryReturn } from './common';
import { getPage } from '../api';
import { QUERY_KEY } from '../constants';

interface QuerySchemaInput {
  arteryID: string;
}
type QuerySchemaResponse = Artery;
export function useQuerySchema(
  input: QuerySchemaInput,
  options: UseQueryOptions<QuerySchemaResponse | undefined, Error>,
): UseAbstractQueryReturn<QuerySchemaResponse> {
  const { arteryID } = input;
  return useAbstractQuery<QuerySchemaInput, QuerySchemaResponse | undefined>({}, {
    ...options,
    getQueryKey: () => [QUERY_KEY.SCHEMA, arteryID],
    queryFunction: async () => {
      const schema = await getPage(arteryID);
      if (!schema) {
        return;
      }
      return parseJSON<Artery | undefined>(schema, undefined);
    },
  });
}

