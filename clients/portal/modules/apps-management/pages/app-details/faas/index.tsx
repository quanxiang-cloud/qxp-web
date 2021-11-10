import React from 'react';
import { observer } from 'mobx-react';

import store from './store';
import FuncList from './func';
import NotAvailable from './not-available';
import { useEffect } from 'react';
import AppDetailsStore from '../store';
import { pick } from 'lodash';

function FaaS(): JSX.Element {
  const { developerInGroup, hasGroup, isGroup, isDeveloperInGroup, isaDeveloper } = store;
  const { appDetails } = AppDetailsStore;
  const User = window.USER;
  useEffect(() => {
    store.appDetails = AppDetailsStore.appDetails;
    store.User = pick(User, ['id', 'email']);
    if (appDetails.id) {
      isaDeveloper();
    }
  }, [appDetails, User.id]);

  return (
    <div className="flex-1 bg-white rounded-t-12 h-full">
      {hasGroup && developerInGroup ? <FuncList /> : <NotAvailable />}
    </div>
  );
}

export default observer(FaaS);
