import PageSchemaRender from '@c/page-schema-render';
import React from 'react';

import { getSchemaKey } from './api';

interface Props {
  appId: string;
  pageId: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

function SchemaPage({ appId, pageId, draft }: Props): JSX.Element {
  return (
    <PageSchemaRender
      schemaKey={getSchemaKey(appId, pageId, !!draft)[0]}
      version="0.1.0"
    />
  );
}

export default SchemaPage;
