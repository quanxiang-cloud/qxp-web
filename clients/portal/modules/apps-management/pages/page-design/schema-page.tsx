import PageSchemaRender from '@c/page-schema-render';
import React, { useEffect, useState } from 'react';
import { getSchemaKey } from './utils';

interface Props {
  schemaID: string;
  appId: string;
  pageId: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

function SchemaPage({ schemaID, appId, pageId, draft }: Props): JSX.Element {
  const [schemaKey, setSchemaKey] = useState(getSchemaKey(appId, schemaID, !!draft)[0]);

  useEffect(() => {
    setSchemaKey(getSchemaKey(appId, schemaID, !!draft));
  }, [appId, pageId, !!draft]);

  return (
    <PageSchemaRender
      key={schemaKey}
      schemaKey={schemaKey}
      version="1.0.0"
    />
  );
}

export default SchemaPage;
