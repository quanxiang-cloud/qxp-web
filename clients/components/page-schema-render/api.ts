import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import type { Schema } from '@ofa/schema-spec';
import { Spec } from '@ofa/api-spec-adapter/lib/src/swagger-schema-official';

import logger from '@lib/logger';
import SwaggerRPCSpecAdapter from '@lib/adapter-swagger-rpc';

type SchemaWithSwagger = {
  schema: Schema;
  swagger: Spec;
}

type SchemaWithAdapter = {
  schema: Schema;
  adapter: SwaggerRPCSpecAdapter;
}

export function useSchemaWithAdapter(schemaKey: string, version: string): Partial<SchemaWithAdapter> {
  const [adapter, setAdatper] = useState<SwaggerRPCSpecAdapter | undefined>(undefined);
  const { isLoading, data } = useQuery<Partial<SchemaWithSwagger>>([schemaKey, version], () => {
    const url = `/api/page_schema_with_swagger?schema_key=${schemaKey}&version=${version}`;

    return fetch(url, { method: 'GET' })
      .then((response) => response.json())
      .then(({ data }) => data)
      .catch((err) => {
        logger.error(err);
        return;
      });
  });

  useEffect(() => {
    if (isLoading || !data || !data.schema || !data.swagger) {
      return;
    }

    setAdatper(new SwaggerRPCSpecAdapter(data.swagger, { __disableResponseAdapter: true }));
  }, [isLoading, data]);

  return { schema: data?.schema, adapter: adapter };
}
