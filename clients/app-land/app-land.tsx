import React from 'react';

import { VERSION } from 'clients/constants';
import ArteryRender from '@c/artery-renderer';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return (
    <div style={{ height: '100vh' }}>
      <ArteryRender arteryID={rootSchemaKey} version={VERSION} />
    </div>
  );
}
