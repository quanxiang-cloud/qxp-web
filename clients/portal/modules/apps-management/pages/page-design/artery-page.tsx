import React from 'react';

import ArteryRenderer from '@c/artery-renderer';

interface Props {
  arteryID: string;
  convertor?: (...args: any) => any;
  className?: string;
}

function ArteryPage({ arteryID }: Props): JSX.Element {
  return (
    <ArteryRenderer
      key={arteryID}
      arteryID={arteryID}
      version="1.0.0"
    />
  );
}

export default ArteryPage;
