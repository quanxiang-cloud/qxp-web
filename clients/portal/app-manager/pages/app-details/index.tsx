import React from 'react';
import { Route } from 'react-router-dom';

import Header from './header';
import AppDetailsContent from './app-details-content';
import AppSetting from './app-setting';

function AppDetails() {
  return (
    <div>
      <Header />
      <Route exact path='/apps/details/:appId' component={AppDetailsContent} />
      <Route path='/apps/details/:appId/setting' component={AppSetting} />
    </div>
  );
}

export default AppDetails;
