import React from 'react';
import { useQuery } from 'react-query';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import type { Artery } from '@one-for-all/artery';

import logger from '@lib/logger';
import httpClient from '@lib/http-client';
import SwaggerRPCSpecAdapter from '@lib/api-adapter';
import ErrorBoundary from '@c/artery-renderer/error-boundary';

import swagger from './swagger';
// import schema from './schema';
import { VERSION } from 'clients/constants';

const CONFIG_CENTER_PAGE_SCHEMA_KEY = 'SCHEMA_CONFIG_CENTER';

// window.__schema = schema;

function useSchema(): { schema?: Artery; loading: boolean; } {
  const { isLoading, data } = useQuery<string>('get_my_apps_schema', (): Promise<string> => {
    return httpClient<{ result: Record<string, string>; }>('/api/v1/persona/batchGetValue', {
      keys: [{ key: CONFIG_CENTER_PAGE_SCHEMA_KEY, version: VERSION }],
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
      <ArteryRenderer artery={schema} plugins={{ apiSpecAdapter }} />
    </ErrorBoundary>
  );
}
