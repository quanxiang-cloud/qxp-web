import React from 'react';
import { useParams } from 'react-router-dom';

import ArteryPage from '../artery-page';

function PagePreview(): JSX.Element {
  const { appID, pageId } = useParams<{appID: string, pageId: string}>();

  return (
    <ArteryPage appId={appID} pageId={pageId} draft />
  );
}

export default PagePreview;
