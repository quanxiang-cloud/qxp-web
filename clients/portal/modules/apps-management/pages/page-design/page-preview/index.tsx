import React from 'react';
import { getQuery } from '@lib/utils';

import ArteryPage from '../artery-page';

function PagePreview(): JSX.Element {
  const { arteryID } = getQuery<{appID: string, pageId: string, arteryID: string}>();

  return <ArteryPage arteryID={arteryID} />;
}

export default PagePreview;
