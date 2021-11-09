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

function SubPage({ namespace, action = '' }: SubPageProps): JSX.Element {
  if (namespace) {
    if (['add', 'edit'].includes(action)) {
      return <Add />;
    }
    if (action === 'add-swagger') {
      return <AddSwagger />;
    }
  }
  return <List />;
}

function ApiProxy(): JSX.Element | null {
  const qs = useQueryString();
  const ns = useNamespace();
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

  return (
    <div className='bg-white mt-20 mx-20 api-proxy'>
      <SideNav />
      <div className='w-full h-full overflow-auto api-proxy--main-cont'>
        <SubPage
          namespace={ns}
          action={qs.get('action') || ''}
        />
      </div>
    </div>
  );
}

export default observer(ApiProxy);
