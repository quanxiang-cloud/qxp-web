import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const Dashboard = lazy(
  () => import('./pages/dashboard'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

const pathPrefix = '/mobile';

export default (
  <Suspense fallback={<div/>}>
    <Switch>
      <Route exact path={`${pathPrefix}`} component={Dashboard} />
      <Route exact path={`${pathPrefix}/apps/:appID`} component={AppDetails} />
    </Switch>
  </Suspense>
);
