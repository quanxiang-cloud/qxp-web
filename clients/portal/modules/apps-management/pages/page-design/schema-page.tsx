import PageSchemaRender from '@c/page-schema-render';
import React, { useEffect, useState } from 'react';
import { getSchemaKey } from './utils';

interface Props {
  schemaID: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

function SchemaPage({ schemaID, draft }: Props): JSX.Element {
  const [schemaKey, setSchemaKey] = useState(getSchemaKey(schemaID, !!draft));

  useEffect(() => {
    setSchemaKey(getSchemaKey(schemaID, !!draft));
  }, [schemaID, !!draft]);

  return (
    <PageSchemaRender
      key={schemaKey}
      schemaKey={schemaKey}
      version="1.0.0"
    />
  );
}

export default SchemaPage;
