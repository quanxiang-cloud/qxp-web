import React from 'react';
import { getQuery } from '@lib/utils';

import SchemaPage from '../schema-page';

function PagePreview(): JSX.Element {
  const { schemaID } = getQuery<{appID: string, pageId: string, schemaID: string}>();

  return (
    <SchemaPage schemaID={schemaID} draft />
  );
}

export default PagePreview;
