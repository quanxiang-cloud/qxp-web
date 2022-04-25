import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Loading from '@c/loading';

import store from './store';
import FuncList from './func';
import NotAvailable from './not-available';
import { faasState } from './constants';
import { useParams } from 'react-router-dom';

function FaaS(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const { checkUserState, setAppID } = store;

  useEffect(() => {
    setAppID(appID);
    checkUserState();
    return () => {
      store.clear();
    };
  }, []);

  if (store.checkUserLoading) {
    return <Loading/>;
  }

  return (
    <div className="h-full bg-white rounded-t-12">
      {store.step === faasState.INGROUP ? <FuncList /> : <NotAvailable />}
    </div>
  );
}

export default observer(FaaS);
