import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { QueryClient, QueryClientProvider } from 'react-query';

// import GlobalHeader from './global-header';

// import stores from './stores';
// import routers from './routers';

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
    <h1>this is home page</h1>
  );
  // return (
  //   <Provider {...stores}>
  //     <QueryClientProvider client={queryClient}>
  //       <div className="min-h-screen bg-5976e01a">
  //         <BrowserRouter>
  //           <GlobalHeader />
  //           {routers}
  //         </BrowserRouter>
  //       </div>
  //     </QueryClientProvider>
  //   </Provider>
  // );
}

export default App;
