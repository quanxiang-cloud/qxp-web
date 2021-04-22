import React from 'react';
import { LocaleProvider } from '@QCFE/lego-ui';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalHeader from './global-header';
import Loading from '@c/loading';

import locales from './locales';
import Routes from './routes';

// ensure web socket connection
// todo how about on app-manager page?
import '@lib/push';

export default function Application() {
  return (
    <LocaleProvider locales={locales} >
      <Router>
        <div className="h-full flex flex-col">
          <GlobalHeader />
          <React.Suspense fallback={<Loading className="h-full" desc="加载中..." />}>
            <Routes />
          </React.Suspense>
        </div>
      </Router>
    </LocaleProvider>
  );
}
