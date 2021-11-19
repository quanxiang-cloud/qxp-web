import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { pick } from 'lodash';
import { useHistory } from 'react-router-dom';

import Loading from '@c/loading';

import store from './store';
import FuncList from './func';
import AppDetailsStore from '../store';
import NotAvailable from './not-available';

function FaaS(): JSX.Element {
  const history = useHistory();
  const { developerInGroup, hasGroup, checkUserState } = store;
  const { appDetails } = AppDetailsStore;
  const User = window.USER;
  useEffect(() => {
    store.appDetails = AppDetailsStore.appDetails;

    store.User = pick(User, ['id', 'email']);
    if (appDetails.id) {
      if (!store.appDetails.appSign) history.push('base_info');
      checkUserState();
    }
  }, [appDetails, User.id]);

  if (store.checkUserLoading) {
    return <Loading/>;
  }

  return (
    <div className="flex-1 bg-white rounded-t-12 h-full">
      {hasGroup && developerInGroup ? <FuncList /> : <NotAvailable />}
    </div>
  );
}

export default observer(FaaS);
