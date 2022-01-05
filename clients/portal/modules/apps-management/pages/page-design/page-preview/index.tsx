import React from 'react';
import { useParams } from 'react-router-dom';

import SchemaPage from '../schema-page';

function PagePreview(): JSX.Element {
  const { appID, pageId } = useParams<{appID: string, pageId: string}>();

  return (
    <SchemaPage appId={appID} pageId={pageId} draft />
  );
}

export default PagePreview;
