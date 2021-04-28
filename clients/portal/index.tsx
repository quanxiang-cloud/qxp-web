import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';

import App from './application';
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

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <App/>
    </RecoilRoot>
  </QueryClientProvider>,
  document.getElementById('root'),
);
