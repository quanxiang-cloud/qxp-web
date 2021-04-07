import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

import PageLoading from '@appC/page-loading';
import Error from '@c/error';

const AppManagerEntry = lazy(
  () => import('./pages/entry'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

const AppSetting = lazy(
  () => import('./pages/app-setting'),
);

export default (
  <Suspense fallback={(<PageLoading />)}>
    <Switch>
      <Route exact path="/appManager/list" component={AppManagerEntry} />
      <Route exact path="/appManager/details/:appId" component={AppDetails} />
      <Route exact path="/appManager/setting/:appId" component={AppSetting} />
      <Route component={Error} />
    </Switch>
  </Suspense>
);
