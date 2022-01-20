import React, { useMemo } from 'react';

import PageSchemaRender from '@c/page-schema-render';
import { getSchemaKey, getVersionKey, getRenderRepository } from './api';

interface Props {
  appId: string;
  pageId: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

const entity = (x: any)=> x;

function SchemaPage({ appId, pageId, draft, convertor }: Props) {
  const repository = useMemo(()=> getRenderRepository(), []);

  return (
    <PageSchemaRender
      key={pageId}
      schemaKey={getSchemaKey(appId, pageId, !!draft)}
      version={getVersionKey()}
      repository={repository}
    />
  );
}

export default SchemaPage;
