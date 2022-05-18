import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';

import store from './store';
import GroupDetails from './group-details';
import GroupNav from './group-nav';

import '../index.scss';
import Loading from '@c/loading';

function GroupManagement(): JSX.Element {
  useEffect(() => {
    store.loading = true;
    store.fetchGroupMenus();

    return store.reset;
  }, []);

  if (store.loading) {
    return <Loading />;
  }

  return (
    <>
      <TextHeader
        title='分组管理'
        className="bg-gray-1000 px-20 header-background-image border-b-1"
        itemTitleClassName="text-h5"
      />
      <div className="flex text-gray-600" style={{ height: 'calc(100% - 44px)' }}>
        <GroupNav />
        <GroupDetails />
      </div>
    </>
  );
}

export default observer(GroupManagement);
