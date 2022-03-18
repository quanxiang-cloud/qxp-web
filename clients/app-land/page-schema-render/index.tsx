import React from 'react';
import { Repository, SchemaRender } from '@one-for-all/render-engine';

import { useSchemaWithAdapter } from './api';
import ErrorBoundary from './error-boundary';

type Props = {
  schemaKey: string;
  version: string;
  repository?: Repository;
  maxHeight?: string;
}

export default function PageSchemaRender(
  { schemaKey, version, repository, maxHeight }: Props,
): JSX.Element | null {
  const { schema, adapter } = useSchemaWithAdapter(schemaKey, version);

  if (!schema || !adapter) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div
        className="overflow-auto relative z-0"
        style={{ maxHeight: maxHeight || '100vh', height: '100vh' }}
      >
        <SchemaRender schema={schema} plugins={{ apiSpecAdapter: adapter, repository }} />
      </div>
    </ErrorBoundary>
  );
}
