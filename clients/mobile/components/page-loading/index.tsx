import React from 'react';

import Loading from '@m/qxp-ui-mobile/loading';
import AbsoluteCentered from '@c/absolute-centered';

export default function PageLoading(): JSX.Element {
  return (
    <AbsoluteCentered>
      <Loading size='.4rem'/>
    </AbsoluteCentered>
  );
}
