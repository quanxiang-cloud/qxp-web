import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import PageNav from './page-nav';
import PageDetails from './page-details';
import './index.scss';

type Props = {
  appPagesStore: any
}

function AppDetailsContent({ appPagesStore }: Props) {
  const { appId } = useParams<any>();

  useEffect(() => {
    appPagesStore.fetchPageList(appId);
  }, [appId]);

  return (
    <div className='app-manager-height flex relative'>
      <PageNav />
      <PageDetails />
    </div>
  );
}

export default inject('appPagesStore')(observer(AppDetailsContent));
