import React from 'react';

import ArteryRenderer from '@c/artery-renderer';
import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return <ArteryRenderer arteryID={rootSchemaKey} version={VERSION} />;
}
