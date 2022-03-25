import PageSchemaRender from '@c/page-schema-render';
import React, { useEffect, useState } from 'react';

import { getSchemaKey } from './api';

interface Props {
  appId: string;
  pageId: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

function SchemaPage({ appId, pageId, draft }: Props): JSX.Element {
  const [schemaKey, setSchemaKey] = useState(getSchemaKey(appId, pageId, !!draft)[0]);

  useEffect(() => {
    setSchemaKey(getSchemaKey(appId, pageId, !!draft)[0]);
  }, [appId, pageId, !!draft]);

  return (
    <PageSchemaRender
      key={schemaKey}
      schemaKey={schemaKey}
      version="0.1.0"
    />
  );
}

export default SchemaPage;
