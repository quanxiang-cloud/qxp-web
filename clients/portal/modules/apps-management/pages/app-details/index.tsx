import React, { useEffect } from 'react';
import { Route, useParams } from 'react-router-dom';

import Header from './header';
import AppDetailsContent from './app-details-content';
import AppSetting from './app-setting';
import appDetailsStore from './store';

function AppDetails() {
  const { appID } = useParams<{appID: string}>();

  useEffect(() => {
    appDetailsStore.fetchAppDetails(appID);
    return () => {
      appDetailsStore.clear();
    };
  }, [appID]);

  return (
    <div>
      <Header />
      <Route path='/apps/details/:appID/setting' component={AppSetting} />
      <Route exact path='/apps/details/:appID/:menuType' component={AppDetailsContent} />
    </div>
  );
}

export default AppDetails;
