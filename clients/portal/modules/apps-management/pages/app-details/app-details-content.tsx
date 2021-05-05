import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import PageNav from './page-nav';
import PageDetails from './page-details';
import appPagesStore from './store';
import './index.scss';

function AppDetailsContent() {
  const { appId } = useParams<any>();

  useEffect(() => {
    appPagesStore.fetchPageList(appId);
  }, [appId]);

  return (
    <div className='apps-management-height flex relative'>
      <PageNav />
      <PageDetails />
    </div>
  );
}

export default observer(AppDetailsContent);
