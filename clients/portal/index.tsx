import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './application';

import './scss/index.scss';

ReactDOM.render(
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root'),
);
