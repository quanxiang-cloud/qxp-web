import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PageLoading from '@m/components/page-loading';

const Dashboard = lazy(
  () => import('./pages/dashboard'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

const Account = lazy(
  () => import('./pages/account/routes'),
);

const Approvals = lazy(
  () => import('./pages/approvals/routes'),
);

export const pathPrefix = '/mobile';

export default (
  <Suspense fallback={<PageLoading />}>
    <Switch>
      <Route exact path={`${pathPrefix}`} component={Dashboard} />
      <Route exact path={`${pathPrefix}/apps/:appID`} component={AppDetails} />
      <Route path={`${pathPrefix}/approvals`} component={Approvals} />
      <Route path={`${pathPrefix}/account`} component={Account} />
    </Switch>
  </Suspense>
);
