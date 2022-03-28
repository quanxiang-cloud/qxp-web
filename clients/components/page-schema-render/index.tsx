import React from 'react';
import { SchemaRender } from '@one-for-all/render-engine';

import { useSchemaWithAdapter } from './api';
import ErrorBoundary from './error-boundary';
import componentLoader from './component-loader';
import repository from './repository';
import refLoader from './ref-loader';

type Props = {
  schemaKey: string;
  version: string;
}

export default function PageSchemaRender({ schemaKey, version }: Props): JSX.Element | null {
  const { schema, adapter } = useSchemaWithAdapter(schemaKey, version);
  const plugins = { apiSpecAdapter: adapter, repository, componentLoader, refLoader };

  if (!schema || !adapter) {
    return null;
  }

  return (
    <ErrorBoundary>
      {/* @ts-ignore */}
      <SchemaRender schema={schema} plugins={plugins} />
    </ErrorBoundary>
  );
}
