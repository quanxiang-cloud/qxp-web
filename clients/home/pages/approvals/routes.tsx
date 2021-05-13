import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Approvals = React.lazy(() => import('./list'));
const ApprovalDetail = React.lazy(() => import('./detail'));

export default function ApprovalRoutes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/approvals" component={Approvals} />
      <Route path="/approvals/:processInstanceID/:taskID" component={ApprovalDetail} />
    </Switch>
  );
}
