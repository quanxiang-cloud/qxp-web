import React from 'react';

import ArteryPage from '@portal/modules/apps-management/pages/page-design/artery-page';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return <ArteryPage arteryID={rootSchemaKey} />;
}
