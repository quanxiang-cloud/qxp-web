import React from 'react';
import { ArteryRenderer } from '@one-for-all/artery-renderer';

import { useArteryWithAdapter } from './api';
import ErrorBoundary from './error-boundary';
import componentLoader from './component-loader';
import refLoader from './ref-loader';
import repository from './repository';

type Props = {
  arteryID: string;
  version: string;
}

export default function Renderer({ arteryID, version }: Props): JSX.Element | null {
  const { artery, adapter } = useArteryWithAdapter(arteryID, version);

  if (!artery || !adapter) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ArteryRenderer
        artery={artery}
        plugins={{ apiSpecAdapter: adapter, repository, componentLoader, refLoader }}
      />
    </ErrorBoundary>
  );
}
