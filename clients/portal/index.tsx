import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as MobxProvider } from 'mobx-react';
import { LocaleProvider } from '@QCFE/lego-ui';

// ensure web socket connection
// todo how about on app-manager page?
import '@lib/push';

import App from './application';
import stores from './stores';
import locales from './locales';
import './scss/index.scss';
import '../styles/index.css';
import { registerValidationFormats, setValidationLocale } from '@formily/antd';

registerValidationFormats({
  post_code: /^[1-9]\d{5}$/g,
  telephone: /0\d{2,3}-[1-9]\d{6,7}/g,
});

setValidationLocale({
  zh: {
    post_code: '该字段不是合法的邮编格式',
    telephone: '该字段不是有效的固定电话号码',
  },
});

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
  <MobxProvider {...stores}>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locales={locales}>
        <Router>
          <App/>
        </Router>
      </LocaleProvider>
    </QueryClientProvider>
  </MobxProvider>,
  document.getElementById('root'),
);
