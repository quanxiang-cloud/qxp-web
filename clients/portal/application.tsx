import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalHeader from './global-header';
import Loading from '@c/loading';

import Routes from './routes';

export default function Application() {
  return (
    <Router>
      <GlobalHeader />
      <React.Suspense fallback={<Loading className="w-screen h-screen" desc="加载中..." />}>
        <Routes />
      </React.Suspense>
    </Router>
  );
}
