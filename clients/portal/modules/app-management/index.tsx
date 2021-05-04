import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { isEmpty } from 'lodash';

import '../../scss/index.scss';
import '../../../styles/index.css';
import './index.scss';

import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';
import GlobalHeader from '@portal/global-header';
import { getNestedPropertyToArray } from '@lib/utils';

import routers from './routers';

import MsgStores from '../../stores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const { USER } = window;
if (USER && !isEmpty(USER)) {
  USER.depIds = getNestedPropertyToArray<string>(USER?.dep, 'id', 'child');
}

function App() {
  const [_, setValue] = usePortalGlobalValue();

  useEffect(() => {
    setValue((val) => ({
      ...val,
      userInfo: {
        ...USER,
        depIds: USER?.depIds || [],
        authority: window.ADMIN_USER_FUNC_TAGS || [],
        roles: window.USER_ADMIN_ROLES || [],
      },
    }));
  }, []);

  return (
    <Provider {...MsgStores}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-5976e01a">
          <BrowserRouter>
            <GlobalHeader />
            {routers}
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

