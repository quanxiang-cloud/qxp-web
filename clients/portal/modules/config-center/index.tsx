import React from 'react';
import { useQuery } from 'react-query';
import { SchemaRender, Schema } from '@ofa/render-engine';
import logger from '@lib/logger';

import ErrorBoundary from '@c/page-schema-render/error-boundary';
import SwaggerRPCSpecAdapter from '@lib/adapter-swagger-rpc';
// import schema from './schema';
import swagger from './swagger';
import httpClient from '@lib/http-client';

const CONFIG_CENTER_PAGE_SCHEMA_KEY = 'SCHEMA_CONFIG_CENTER';

// window.__schema = schema;

function useSchema(): { schema?: Schema; loading: boolean; } {
  const { isLoading, data } = useQuery<string>('get_my_apps_schema', (): Promise<string> => {
    return httpClient<{ result: Record<string, string>; }>('/api/v1/persona/batchGetValue', {
      keys: [{ key: CONFIG_CENTER_PAGE_SCHEMA_KEY, version: '1.0.0' }],
    }).then(({ result }) => result[CONFIG_CENTER_PAGE_SCHEMA_KEY]);
  });

  if (!data || isLoading) {
    return { loading: true };
  }

  try {
    const schema = JSON.parse(data);
    return { schema, loading: false };
  } catch (error) {
    return { loading: true };
  }
}

export default function MyApps(): JSX.Element | null {
  const apiSpecAdapter = new SwaggerRPCSpecAdapter(swagger);
  const { schema, loading } = useSchema();

  if (loading) {
    return null;
  }

  if (!schema) {
    logger.error('failed to get my app schema');
    return null;
  }

  return (
    <ErrorBoundary>
      <SchemaRender schema={schema} apiSpecAdapter={apiSpecAdapter} />
    </ErrorBoundary>
  );
}
