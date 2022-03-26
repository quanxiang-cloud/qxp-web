import { useEffect, useState } from 'react';
import type { Schema } from '@one-for-all/schema-spec';
import { Spec } from '@one-for-all/api-spec-adapter/lib/src/swagger-schema-official';

import logger from '@lib/logger';
import SwaggerRPCSpecAdapter from '@lib/api-adapter';

type SchemaWithSwagger = {
  schema: Schema;
  swagger: Spec;
}

type SchemaWithAdapter = {
  schema: Schema;
  adapter: SwaggerRPCSpecAdapter;
}

function fetchSchemaWithSwagger(schemaKey: string, version: string): Promise<Partial<SchemaWithSwagger>> {
  const url = `/api/page_schema_with_swagger?schema_key=${schemaKey}&version=${version}`;

  return fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then(({ data }) => data)
    .catch((err) => {
      logger.error(err);
      return {};
    });
}

export function useSchemaWithAdapter(schemaKey: string, version: string): Partial<SchemaWithAdapter> {
  const [adapter, setAdapter] = useState<SwaggerRPCSpecAdapter>();
  const [schema, setSchema] = useState<Schema>();

  useEffect(() => {
    fetchSchemaWithSwagger(schemaKey, version).then((res) => {
      if (res.schema) {
        setSchema(res.schema);
      }

      if (res.swagger) {
        setAdapter(new SwaggerRPCSpecAdapter(res.swagger));
      }
    });
  }, [schemaKey, version]);

  return { schema, adapter };
}
