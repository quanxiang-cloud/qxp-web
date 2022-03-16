import React from 'react';
import { Repository, SchemaRender } from '@one-for-all/render-engine';

import { useSchemaWithAdapter } from './api';
import ErrorBoundary from './error-boundary';

type Props = {
  schemaKeys: string[];
  version: string;
  repository?: Repository;
  maxHeight?: string;
}

export default function PageSchemaRender(
  { schemaKeys, version, repository, maxHeight }: Props,
): JSX.Element | null {
  const [schemaKey, newSchemaKey] = schemaKeys;
  const { schema: oldSchema, adapter: oldAdapter } = useSchemaWithAdapter(schemaKey, version);
  const { schema: newSchema, adapter: newAdapter } = useSchemaWithAdapter(newSchemaKey, version);
  const schema = newSchema || oldSchema;
  const adapter = newAdapter || oldAdapter;

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
