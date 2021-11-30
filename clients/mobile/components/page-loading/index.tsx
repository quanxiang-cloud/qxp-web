import Loading from '@m/qxp-ui-mobile/loading';
import AbsoluteCentered from '@c/absolute-centered';
import React from 'react';

export default function PageLoading(): JSX.Element {
  return (
    <AbsoluteCentered>
      <Loading size='.4rem'/>
    </AbsoluteCentered>
  );
}
