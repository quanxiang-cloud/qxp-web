import GlobalHeader from '@home/components/global-header';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFoundError from '@c/404-error';

const Approvals = React.lazy(() => import('./list'));
const ApprovalDetail = React.lazy(() => import('./detail'));

export default function ApprovalRoutes(): JSX.Element {
  return (
    <>
      <GlobalHeader />
      <Switch>
        <Route exact path="/approvals" component={Approvals} />
        <Route path="/approvals/:processInstanceID/:taskID/:type" component={ApprovalDetail} />
        <Route component={() => <NotFoundError url='/approvals' classnames='main-content'/>}/>
      </Switch>
    </>
  );
}
