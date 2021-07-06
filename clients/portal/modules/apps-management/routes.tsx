import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ErrorTips from '@c/error-tips';

const AppsIndex = React.lazy( () => import('./index'));
const AppDetails = React.lazy(() => import('./pages/app-details'));
const FormDesign = React.lazy(() => import('./pages/form-design'));
const FlowDetail = React.lazy(() => import('./work-flow/detail'));

export default function Routes(): JSX.Element {
  // todo: 确定具体的authority?
  if (!window.ADMIN_USER_FUNC_TAGS.includes('application')) {
    return <ErrorTips desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <Switch>
      <Route exact path="/apps" component={AppsIndex} />
      <Route path="/apps/details/:appID" component={AppDetails} />
      <Route
        exact
        path="/apps/formDesign/:pageType/:pageId/:appID/:navType?"
        component={FormDesign}
      />
      <Route path="/apps/flow/new/:type/:appID" component={FlowDetail} />
      <Route path="/apps/flow/:appID/:flowID" component={FlowDetail} />
    </Switch>
  );
}
