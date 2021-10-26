import React from 'react';
import { observer } from 'mobx-react';

import Loading from '@c/loading';

import SideNav from './side-nav';
import List from './api-list';
import Add from './add-api';
import Detail from './api-detail';
import AddSwagger from './add-swagger';
import NoData from './comps/no-data';
import store from './store';
import { useQueryString, useNamespace } from './hooks';

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
    // todo: remove
    if (apiId) {
      return <Detail />;
    }
  }
  return <List />;
}

function ApiProxy(): JSX.Element {
  const qs = useQueryString();
  const ns = useNamespace();

  function renderMain(): JSX.Element {
    if (!store.treeStore) {
      return <Loading />;
    }

    if (!store.activeGroup || store.treeStore.noLeafNodes) {
      return <NoData/>;
    }

    return (
      <div className='w-full h-full overflow-auto api-proxy--main-cont'>
        <SubPage
          namespace={ns}
          apiId={qs.get('api')}
          action={qs.get('action')}
        />
      </div>
    );
  }

  return (
    <div className='flex flex-grow bg-white mt-20 mx-20 api-proxy'>
      <SideNav />
      {renderMain()}
    </div>
  );
}

export default observer(ApiProxy);
