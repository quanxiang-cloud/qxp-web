import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import { OrchestrationAPIStoreProvider } from './context';
import Layout from './layout';
import APINamespace from './containers';
import APINamespaceDetails from './containers/details';
import orchestrationAPIStoreFactory from './store';
import InitApiFail from '../init-api-fail/index';
import { initAppPath } from '../api';

import './style.scss';
import Loading from '@c/loading';

function OrchestrationAPI(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [initApiLoading, setInitApiLoading] = useState(false);
  const orchestrationApiStore = useMemo(() => orchestrationAPIStoreFactory(appID), [appID]);

  if (!orchestrationApiStore.isInitSuccessed && !initApiLoading) {
    return (
      <InitApiFail onClick={() => {
        setInitApiLoading(true);
        initAppPath(appID).then(
          () => orchestrationApiStore.isInitSuccessed = true,
        ).catch(
          () => orchestrationApiStore.isInitSuccessed = false,
        ).finally(() => setInitApiLoading(false));
      }
      }/>
    );
  }

  if (initApiLoading) {
    return <Loading className='bg-white'/>;
  }

  return (
    <OrchestrationAPIStoreProvider orchestrationApiStore={orchestrationApiStore}>
      <Layout left={APINamespace} right={APINamespaceDetails} />
    </OrchestrationAPIStoreProvider>
  );
}

export default observer(OrchestrationAPI);
