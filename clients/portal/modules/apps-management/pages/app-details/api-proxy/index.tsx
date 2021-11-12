import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import Loading from '@c/loading';

import SideNav from './side-nav';
import List from './api-list';
import Add from './add-api';
import AddSwagger from './add-swagger';
import GuidePage from './guide-page';
import store from './store';
import { useQueryString, useNamespace } from './hooks';

import './styles.scss';

interface SubPageProps {
  namespace?: string;
  api_path?: string;
  action?: string;
}

function ApiProxy(): JSX.Element | null {
  const qs = useQueryString();
  const ns = useNamespace();
  const action = qs.get('action');
  const { appID } = useParams<{appID: string}>();

  useEffect(()=> {
    store.setAppId(appID);
    store.fetchNamespaces(appID);

    return store.reset;
  }, []);

  if (!store.treeStore) {
    return <Loading />;
  }

  if (!store.namespaces.length) {
    return <GuidePage />;
  }

  function renderMain(): JSX.Element {
    if (action) {
      if (['add', 'edit'].includes(action)) {
        return <Add />;
      }
      if (action === 'add-swagger') {
        return <AddSwagger />;
      }
    }
    return <List />;
  }

  return (
    <div className='bg-white api-proxy h-full'>
      <SideNav />
      <div className='w-full h-full overflow-auto api-proxy--main-cont'>
        {renderMain()}
      </div>
    </div>
  );
}

export default observer(ApiProxy);
