import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as MobxProvider } from 'mobx-react';
import { RecoilRoot } from 'recoil';
import { AppContextProvider } from '@clients/_legacy/providers/context';

import App from './application';
import stores from './stores';
import './scss/index.scss';
import './index.css';

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
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <App/>
        </RecoilRoot>
      </QueryClientProvider>
    </AppContextProvider>
  </MobxProvider>,
  document.getElementById('root'),
);
