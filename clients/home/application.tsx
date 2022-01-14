import React, { useEffect } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

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
  const history = useHistory();

  useEffect(()=> {
    // setup ctx for page engine
    const ctx = {
      navigateTo,
    };
    if (!window.ctx) {
      Object.assign(window, { ctx });
    } else {
      // eslint-disable-next-line
      console.warn('window.ctx already defined, page engine should choose a better name for ctx')
    }
  }, []);

  function navigateTo(url: string, external?: boolean) {
    if (!url) return;
    if (url.startsWith('http')) {
      // open new page
      const elem = document.createElement('a');
      elem.href = url;
      if (external) {
        elem.target = '_blank';
      }
      elem.click();
      return;
    }
    history.push(url);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {routers}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
