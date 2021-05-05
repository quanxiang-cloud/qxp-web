import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

import PageLoading from '@portal/modules/apps-management/components/page-loading';
import Error from '@c/error';

const AppList = lazy(
  () => import('./pages/app-list'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

export default (
  <Suspense fallback={(<PageLoading />)}>
    <Switch>
      <Route exact path="/" component={AppList} />
      <Route exact path="/appDetails/:appID" component={AppDetails} />
      <Route component={Error} />
    </Switch>
  </Suspense>
);
