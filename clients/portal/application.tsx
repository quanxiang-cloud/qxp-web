import React from 'react';

import usePageEngineCtx from '@lib/hooks/use-page-engine-ctx';
import Routes from './routes';

export default function Application(): JSX.Element {
  usePageEngineCtx();
  return (
    <Routes />
  );
}
