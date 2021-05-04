import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as MobxProvider } from 'mobx-react';
import { RecoilRoot } from 'recoil';
import { LocaleProvider } from '@QCFE/lego-ui';

// ensure web socket connection
// todo how about on app-manager page?
import '@lib/push';

import App from './application';
import stores from './stores';
import locales from './locales';
import './scss/index.scss';
import '../styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 如果用户离开您的应用程序并返回到过时的数据，React Query会在后台自动为您请求新数据。
      refetchOnWindowFocus: false, // 全局禁用
      retry: 1,
    },
  },
});

Object.assign(window, { _stores: stores }); // fixme: debug

ReactDOM.render(
  <MobxProvider {...stores}>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <LocaleProvider locales={locales}>
          <Router>
            <App/>
          </Router>
        </LocaleProvider>
      </RecoilRoot>
    </QueryClientProvider>
  </MobxProvider>,
  document.getElementById('root'),
);
