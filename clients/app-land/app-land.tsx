import React from 'react';

import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';
import ArteryRender from '@c/artery-render';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return (
    <div style={{ height: '100vh' }}>
      <ArteryRender schemaKey={rootSchemaKey} version={VERSION} />
    </div>
  );
}
