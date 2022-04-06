import React from 'react';
import { getQuery } from '@lib/utils';

import SchemaPage from '../schema-page';

function PagePreview(): JSX.Element {
  const { appID, pageId, schemaID } = getQuery<{appID: string, pageId: string, schemaID: string}>();

  return (
    <SchemaPage schemaID={schemaID} appId={appID} pageId={pageId} draft />
  );
}

export default PagePreview;
