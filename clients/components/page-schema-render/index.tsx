import React from 'react';
import { Repository, SchemaRender, Schema } from '@ofa/render-engine';

import { useSchemaWithAdapter } from './api';
import ErrorBoundary from './error-boundary';

type Props = {
  schemaKey: string;
  version: string;
  repository?: Repository;
  schemaConvertor?: (schema: Schema)=> any;
}

export default function PageSchemaRender({ schemaKey, version, repository, schemaConvertor }: Props): JSX.Element | null {
  const { schema, adapter } = useSchemaWithAdapter(schemaKey, version);

  if (!schema || !adapter) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SchemaRender schema={schemaConvertor ? schemaConvertor(schema) : schema} apiSpecAdapter={adapter} repository={repository} />
    </ErrorBoundary>
  );
}
