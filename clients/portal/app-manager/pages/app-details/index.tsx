import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import Drawer from '@c/drawer';

import AppSetting from './app-setting';
import PageNav from './page-nav';
import './index.scss';

type Props = {
  appDetailsStore: any
}

function AppDetails({ appDetailsStore }: Props) {
  const { isOpenSetting, appId } = useParams<any>();
  const { fetchAppDetails, visibleAppManager, setVisibleAppManager } = appDetailsStore;

  useEffect(() => {
    fetchAppDetails(appId);
  }, [appId]);

  useEffect(() => {
    if (isOpenSetting === 'openSetting') {
      setVisibleAppManager(true);
      window.history.replaceState({}, '', '/appManager/details');
    }
  }, []);

  return (
    <div className='app-manager-height flex'>
      <PageNav />
      <div className='app-details-container'></div>
      {visibleAppManager ? (
        <Drawer
          title='应用管理'
          onCancel={() => setVisibleAppManager(false)}
        >
          <AppSetting />
        </Drawer>
      ) : null}
    </div>
  );
}

export default inject('appDetailsStore')(observer(AppDetails));
