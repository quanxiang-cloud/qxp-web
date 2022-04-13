import React from 'react';

import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';
import ArteryRender from '@c/artery-renderer';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <ArteryRender arteryID={rootSchemaKey} version={VERSION} />
    </div>
  );
}
