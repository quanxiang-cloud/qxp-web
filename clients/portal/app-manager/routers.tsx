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

export default (
  <Suspense fallback={(<PageLoading />)}>
    <Switch>
      <Route exact path="/appManager/list" component={AppManagerEntry} />
      <Route exact path="/appManager/details/:appId/:isOpenSetting?" component={AppDetails} />
      <Route component={Error} />
    </Switch>
  </Suspense>
);
