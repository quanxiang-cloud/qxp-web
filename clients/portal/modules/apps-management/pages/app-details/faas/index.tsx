import React from 'react';
import { observer } from 'mobx-react';

import store from './store';
import FuncList from './func';
import { useEffect } from 'react';
import AppDetailsStore from '../store';
import NotAvailable from './not-available';
import { pick } from 'lodash';
import Loading from '@c/loading';

function FaaS(): JSX.Element {
  const { developerInGroup, hasGroup, isGroup, isDeveloperInGroup, isaDeveloper, checkUserLoading, checkUserSate } = store;
  const { appDetails } = AppDetailsStore;
  const User = window.USER;
  useEffect(() => {
    store.appDetails = AppDetailsStore.appDetails;
    store.User = pick(User, ['id', 'email']);
    if (appDetails.id) {
      // isaDeveloper();
      checkUserSate();
    }
  }, [appDetails, User.id]);

  if (store.checkUserLoading) {
    return <Loading/>;
  }

  return (
    <div className="flex-1 bg-white rounded-t-12 h-full">
      {hasGroup && developerInGroup ? <FuncList /> : <NotAvailable />}
      {/* <FuncList /> */}
      {/* {store.listShow ? <FuncList /> : <NotAvailable />} */}
    </div>
  );
}

export default observer(FaaS);
