import React from 'react';
import { observer } from 'mobx-react';

import Loading from '@c/loading';

import SideNav from './side-nav';
import List from './api-list';
import Add from './add-api';
import Detail from './api-detail';
import AddSwagger from './add-swagger';
import NoData from './no-data';

import store from './stores';
import { useQueryString } from './hooks';

import './styles.scss';

interface SubPageProps {
  namespace?: string | null;
  apiId?: string | null;
  action?: string | null;
}

function SubPage({ namespace, apiId, action }: SubPageProps) {
  if (namespace) {
    if (['add', 'edit'].includes(action || '')) {
      return <Add />;
    }
    if (action === 'add-swagger') {
      return <AddSwagger />;
    }
    if (apiId) {
      return <Detail />;
    }
  }
  return <List />;
}

function ApiProxy() {
  const qs = useQueryString();

  const renderMain = (): JSX.Element=> {
    if (!store.treeStore) {
      return <Loading />;
    }

    if (!store.activeGroup || store.treeStore.noLeafNodes) {
      return <NoData/>;
    }

    return (
      <div className='w-full h-full overflow-auto api-proxy--main-cont'>
        <SubPage
          namespace={qs.get('ns')}
          apiId={qs.get('api')}
          action={qs.get('action')}
        />
      </div>
    );
  };

  return (
    <div className='flex flex-grow bg-white mt-20 mx-20 api-proxy'>
      <SideNav />
      {renderMain()}
    </div>
  );
}

export default observer(ApiProxy);
