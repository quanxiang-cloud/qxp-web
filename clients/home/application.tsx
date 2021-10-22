import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import GlobalHeader from './components/global-header';

import routers from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalHeader />
        {routers}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
