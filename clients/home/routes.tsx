import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import PageLoading from '@c/page-loading';
import NotFoundError from '@c/404-error';

const Dashboard = lazy(
  () => import('./pages/dashboard'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

const Approvals = lazy(() => import('./pages/approvals/routes'));

export default (
  <Suspense fallback={(<PageLoading />)}>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/apps/:appID" component={AppDetails} />
      <Route path="/approvals" component={Approvals} />
      <Route component={NotFoundError}/>
    </Switch>
  </Suspense>
);
