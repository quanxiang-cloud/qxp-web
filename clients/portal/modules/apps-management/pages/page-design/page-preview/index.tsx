import React from 'react';
import { getQuery } from '@lib/utils';

import ArteryPage from '../artery-page';

function PagePreview(): JSX.Element {
  const { arteryID } = getQuery<{appID: string, pageId: string, arteryID: string}>();

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <ArteryPage arteryID={arteryID} draft />
    </div>
  );
}

export default PagePreview;
