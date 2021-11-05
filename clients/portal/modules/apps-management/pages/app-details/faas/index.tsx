import React from 'react';
import { observer } from 'mobx-react';

import store from './store';
import FuncList from './func';
import NotAvailable from './not-available';
import { useEffect } from 'react';

function FaaS(): JSX.Element {
  const { developerInGroup, hasGroup, isInGroup, isDeveloperInGroup } = store;

  useEffect(() => {
    isInGroup();
    isDeveloperInGroup();
  }, []);

  return (
    <div className="flex-1 bg-white rounded-t-12 h-full">
      {hasGroup && developerInGroup ? <FuncList /> : <NotAvailable />}
    </div>
  );
}

export default observer(FaaS);
