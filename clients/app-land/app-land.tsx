import React from 'react';

import ArteryRenderer from '@c/artery-renderer';
import { ARTERY_VERSION } from '@portal/constants';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return <ArteryRenderer arteryID={rootSchemaKey} version={ARTERY_VERSION} />;
}
