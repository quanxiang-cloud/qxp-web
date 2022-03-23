import React from 'react';
import { Repository, SchemaRender } from '@one-for-all/render-engine';
import * as OneForAllUI from '@one-for-all/ui';

import { useSchemaWithAdapter } from './api';
import ErrorBoundary from './error-boundary';
import componentLoader from './component-loader';

// todo fix this
const repository: Repository = {
  // @ts-ignore
  'ofa-ui@latest': OneForAllUI,
};

type Props = {
  schemaKey: string;
  version: string;
}

export default function PageSchemaRender({ schemaKey, version }: Props): JSX.Element | null {
  const { schema, adapter } = useSchemaWithAdapter(schemaKey, version);

  if (!schema || !adapter) {
    return null;
  }

  return (
    <ErrorBoundary>
      {/* @ts-ignore */}
      <SchemaRender schema={schema} plugins={{ apiSpecAdapter: adapter, repository, componentLoader }} />
    </ErrorBoundary>
  );
}
