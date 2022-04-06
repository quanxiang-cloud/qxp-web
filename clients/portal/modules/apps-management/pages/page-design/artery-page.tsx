import React, { useEffect, useState } from 'react';

import ArteryRenderer from '@c/artery-renderer';

import { getArteryKey } from './api';

interface Props {
  appId: string;
  pageId: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

function ArteryPage({ appId, pageId, draft }: Props): JSX.Element {
  const [arteryKey, setArteryKey] = useState(getArteryKey(appId, pageId, !!draft)[0]);

  useEffect(() => {
    setArteryKey(getArteryKey(appId, pageId, !!draft)[0]);
  }, [appId, pageId, !!draft]);

  return (
    <ArteryRenderer
      key={arteryKey}
      arteryID={arteryKey}
      version="0.1.0"
    />
  );
}

export default ArteryPage;
