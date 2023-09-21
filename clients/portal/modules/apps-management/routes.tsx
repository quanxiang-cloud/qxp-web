import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ErrorTips from '@c/error-tips';
import GlobalHeader from '@portal/global-header';

const AppsIndex = React.lazy(() => import('./index'));
const AppDetails = React.lazy(() => import('./pages/app-details'));
const FormDesign = React.lazy(() => import('./pages/form-design'));
// const FlowDetail = React.lazy(() => import('../work-flow'));
const FlowDetail = React.lazy(() => import('../new-work-flow'));
const PageDesign = React.lazy(()=> import('./pages/page-design'));
const PagePreview = React.lazy(()=> import('./pages/page-design/page-preview'));

export default function Routes(): JSX.Element {
  React.useEffect(() => {
    document.title = '应用管理';
  }, []);

  // todo: 确定具体的authority?
  if (!window.ADMIN_USER_FUNC_TAGS.includes('application')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="您没有权限, 请联系管理员..."
      />
    );
  }

  return (
    <>
      <GlobalHeader />
      <Switch>
        <Route path="/apps/details/:appID" component={AppDetails} />
        <Route
          exact
          path="/apps/formDesign/:pageType/:pageId/:appID/:navType?"
          component={FormDesign}
        />
        <Route path="/apps/flow/new/:type/:appID" component={FlowDetail} />
        <Route path="/apps/flow/:appID/:flowID" component={FlowDetail} />
        <Route path="/apps/page-design/:pageId/:appID" component={PageDesign} />
        <Route path="/apps/page-preview/:pageId/:appID" component={PagePreview} />
        <Route path="/apps" component={AppsIndex} />
      </Switch>
    </>
  );
}
