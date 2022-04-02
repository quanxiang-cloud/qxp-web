import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import PageDetails from './page-details';
import store from './store';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

type Props = {
  appID: string;
  tableID: string;
  name: string;
}

function TableSchemaViewRender({ appID, tableID, name }: Props): JSX.Element {
  useEffect(() => {
    store.setAppID(appID);
    store.setTableID(tableID);
    store.setTableName(name);
    store.getAuthority();
  }, [appID, tableID, name]);

  return (
    <QueryClientProvider client={queryClient}>
      <PageDetails />
    </QueryClientProvider>
  );
}

export default observer(TableSchemaViewRender);
