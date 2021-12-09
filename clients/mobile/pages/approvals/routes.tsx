import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import { pathPrefix } from '@m/routes';

export const approvalsPath = `${pathPrefix}/approvals`;
export const approvalDetailPath = `${pathPrefix}/approvals/:processInstanceID/:taskID/:type`;

const Approvals = lazy(
  () => import('./index'),
);

const ApprovalDetail = lazy(
  () => import('./detail'),
);

export default function AccountRoutes(): JSX.Element {
  return (
    <Switch>
      <Route exact path={approvalsPath} component={Approvals} />
      <Route exact path={approvalDetailPath} component={ApprovalDetail} />
    </Switch>
  );
}
