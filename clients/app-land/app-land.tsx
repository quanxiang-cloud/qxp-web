import React from 'react';

import ArteryRenderer from '@c/artery-renderer';
import { ARTERY_KEY_VERSION } from '@portal/constants';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <ArteryRenderer arteryID={rootSchemaKey} version={ARTERY_KEY_VERSION} />
    </div>
  );
}
