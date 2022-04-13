import React, { useEffect, useState } from 'react';

import ArteryRenderer from '@c/artery-renderer';

import { getArteryKeys } from './utils';
import { VERSION } from '../app-details/view-orchestration/constants';

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
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <ArteryRenderer
        key={arteryKey}
        arteryID={arteryKey}
        version={VERSION}
      />
    </div>
  );
}

export default ArteryPage;
