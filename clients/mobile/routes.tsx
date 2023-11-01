import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import PageLoading from './components/page-loading';
import {
  appsPath, approvalsPath, pathPrefix, accountPath, messagesPath, userOrgPickerPath,
} from './constant';

const Dashboard = lazy(
  () => import('./pages/dashboard'),
);

const Apps = lazy(
  () => import('./pages/apps/routes'),
);

const Messages = lazy(
  () => import('./pages/msg-center/routes'),
);

// const Approvals = lazy(
//   () => import('./pages/approvals/routes'),
// );

const Approvals = lazy(
  () => import('./pages/new-approvals/routes'),
);

const Account = lazy(
  () => import('./pages/account/routes'),
);

// const UserOrgPicker = lazy(
//   () => import('./pages/approvals/detail/actions/user-org-picker'),
// );

const UserOrgPicker = lazy(
  () => import('./pages/new-approvals/detail/actions/user-org-picker'),
);

export default (
  <Suspense fallback={<PageLoading />}>
    <Switch>
      <Route exact path={pathPrefix} component={Dashboard} />
      <Route path={appsPath} component={Apps} />
      <Route path={messagesPath} component={Messages} />
      <Route path={approvalsPath} component={Approvals} />
      <Route path={accountPath} component={Account} />
      <Route path={userOrgPickerPath} component={UserOrgPicker}/>
    </Switch>
  </Suspense>
);
