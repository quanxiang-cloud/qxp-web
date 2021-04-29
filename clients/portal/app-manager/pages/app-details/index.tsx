import React, { useEffect } from 'react';
import { inject } from 'mobx-react';
import { Route } from 'react-router-dom';

import Header from './header';
import AppDetailsContent from './app-details-content';
import AppSetting from './app-setting';

function AppDetails({ appPagesStore }: any) {
  useEffect(() => {
    return () => {
      appPagesStore.clear();
    };
  }, []);

  return (
    <div>
      <Header />
      <Route exact path='/apps/details/:appId' component={AppDetailsContent} />
      <Route path='/apps/details/:appId/setting' component={AppSetting} />
    </div>
  );
}

export default inject('appPagesStore')(AppDetails);
