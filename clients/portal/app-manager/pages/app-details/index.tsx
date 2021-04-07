import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import PageNav from './page-nav';
import './index.scss';

type Props = {
  appDetailsStore: any
}

function AppDetails({ appDetailsStore }: Props) {
  const { appId } = useParams<any>();

  useEffect(() => {
    appDetailsStore.setAppId(appId);
  }, [appId]);

  return (
    <div className='app-manager-height flex'>
      <PageNav />
      <div className='app-details-container'></div>
    </div>
  );
}

export default inject('appDetailsStore')(observer(AppDetails));
