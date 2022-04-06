import React from 'react';
import { getQuery } from '@lib/utils';

import SchemaPage from '../schema-page';

function PagePreview(): JSX.Element {
  const { arteryID } = getQuery<{appID: string, pageId: string, arteryID: string}>();

  return (
    <SchemaPage arteryID={arteryID} draft />
  );
}

export default PagePreview;
