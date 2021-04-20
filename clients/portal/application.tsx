import React, { useContext } from 'react';
import { LocaleProvider } from '@QCFE/lego-ui';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalHeader from './global-header';
import Loading from '@c/loading';
import { AppContext, IContextValue } from '@clients/_legacy/providers/context';

import locales from './locales';
import Routes from './routes';

export default function Application() {
  const { state } = useContext<IContextValue>(AppContext);

  return (
    <LocaleProvider locales={locales} currentLocale={state.siteLang}>
      <Router>
        <GlobalHeader />
        <React.Suspense fallback={<Loading className="h-full" desc="加载中..." />}>
          <Routes />
        </React.Suspense>
      </Router>
    </LocaleProvider>
  );
}
