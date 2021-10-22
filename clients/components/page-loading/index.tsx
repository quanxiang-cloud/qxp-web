import React from 'react';
import { Loading } from '@QCFE/lego-ui';

import AbsoluteCentered from '@c/absolute-centered';

function PageLoading(): JSX.Element {
  return (<AbsoluteCentered><Loading /></AbsoluteCentered>);
}

export default PageLoading;
