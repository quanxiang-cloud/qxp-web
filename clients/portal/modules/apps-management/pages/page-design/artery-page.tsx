import React, { useEffect, useState } from 'react';

import ArteryRenderer from '@c/artery-renderer';

import { getArteryKeys } from './utils';

interface Props {
  arteryID: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

function ArteryPage({ arteryID, draft }: Props): JSX.Element {
  const [arteryKey, setArteryKey] = useState(getArteryKeys(arteryID, !!draft)[0]);

  useEffect(() => {
    setArteryKey(getArteryKeys(arteryID, !!draft)[0]);
  }, [arteryID, !!draft]);

  return (
    <ArteryRenderer
      key={arteryKey}
      arteryID={arteryKey}
      version='1.0.0'
    />
  );
}

export default ArteryPage;
