import React from 'react';

import AbsoluteCentered from '@c/absolute-centered';

function PageLoading(): JSX.Element {
  return (
    <AbsoluteCentered>
      <img src='/dist/images/loading.svg' alt="loading" style={{ width: 32, height: 32 }} />
    </AbsoluteCentered>
  );
}

export default PageLoading;

