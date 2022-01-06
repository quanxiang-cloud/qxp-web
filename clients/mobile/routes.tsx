import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import PageLoading from './components/page-loading';
import { appsPath, approvalsPath, pathPrefix, accountPath, messagesPath } from './constant';

const Dashboard = lazy(
  () => import('./pages/dashboard'),
);

const Apps = lazy(
  () => import('./pages/apps/routes'),
);

const Messages = lazy(
  () => import('./pages/msg-center/routes'),
);

const Approvals = lazy(
  () => import('./pages/approvals/routes'),
);

const Account = lazy(
  () => import('./pages/account/routes'),
);

export default (
  <Suspense fallback={<PageLoading />}>
    <Switch>
      <Route exact path={pathPrefix} component={Dashboard} />
      <Route path={appsPath} component={Apps} />
      <Route path={messagesPath} component={Messages} />
      <Route path={approvalsPath} component={Approvals} />
      <Route path={accountPath} component={Account} />
    </Switch>
  </Suspense>
);
