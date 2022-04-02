import { UseQueryOptions } from 'react-query';
import { Schema } from '@one-for-all/schema-spec';

import { parseJSON } from '@lib/utils';

import { useAbstractQuery, UseAbstractQueryReturn } from './common';
import { getPage } from '../api';
import { QUERY_KEY } from '../constants';

interface QuerySchemaInput {
  appID: string;
  schemaID: string;
}
type QuerySchemaResponse = Schema;
export function useQuerySchema(
  input: QuerySchemaInput,
  options: UseQueryOptions<QuerySchemaResponse | undefined, Error>,
): UseAbstractQueryReturn<QuerySchemaResponse> {
  const { appID, schemaID } = input;
  return useAbstractQuery<QuerySchemaInput, QuerySchemaResponse | undefined>({}, {
    ...options,
    getQueryKey: () => [QUERY_KEY.SCHEMA, appID, schemaID],
    queryFunction: async () => {
      const schema = await getPage(appID, schemaID);
      if (!schema) {
        return;
      }
      return parseJSON<Schema | undefined>(schema, undefined);
    },
  });
}

