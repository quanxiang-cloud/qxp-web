import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import GlobalHeader from './components/global-header';

import routers from './routers';

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
      <div className="min-h-screen bg-5976e01a">
        <BrowserRouter>
          <GlobalHeader />
          {routers}
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
