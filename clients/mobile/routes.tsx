import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PageLoading from '@m/components/page-loading';

const Dashboard = lazy(
  () => import('./pages/dashboard'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

export const pathPrefix = '/mobile';

export default (
  <Suspense fallback={<PageLoading />}>
    <Switch>
      <Route exact path={`${pathPrefix}`} component={Dashboard} />
      <Route exact path={`${pathPrefix}/apps/:appID`} component={AppDetails} />
    </Switch>
  </Suspense>
);
