import React from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';

import RightsItem from './rights-item';
import store from './store';

function RightsGroups() {
  const { rightsList, rightsLoading } = store;

  const handleClick = (key: string, rights: Rights) => {
    switch (key) {
    case 'del':
      store.deleteRight(rights.id);
      break;
    case 'update':
      return store.updatePerGroup(rights);
    case 'addUser':
      return store.updatePerGroupUser(rights);
    }
  };

  if (rightsLoading) {
    return <PageLoading />;
  }

  if (rightsList.length) {
    return (
      <div className='px-20 overflow-auto'>
        {rightsList.map((rights: Rights) => (
          <RightsItem key={rights.id} rights={rights} actions={handleClick} />
        ))}
      </div>
    );
  }

  return (
    <div className='app-no-data mt-58'>
      <img src='/dist/images/new_tips.svg' />
      <span>暂无权限组</span>
    </div>
  );
}

export default observer(RightsGroups);
