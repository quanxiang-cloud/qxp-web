import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Loading from '@c/loading';
import NotFoundError from '@c/404-error';

const Test = React.lazy(() => import('../components/NavigateMenu/test'));
const AppsRoutes = React.lazy(() => import('./modules/apps-management/routes'));
const RedirectToApps = React.lazy(() => import('./modules/dashboard/redirect-to-apps'));
const PagePreview = React.lazy(() => import('./modules/apps-management/pages/page-design/page-preview'));
const PageDesign = React.lazy(() => import('./modules/apps-management/pages/page-design'));
const MetaData = React.lazy(() => import('./modules/metadata'));
const AccessControl = React.lazy(() => import('./modules/access-control'));
const SystemMgmt = React.lazy(() => import('./modules/system-mgmt'));
const PolyAPI = React.lazy(() => import('./modules/poly-api'));
const ConfigCenter = React.lazy(() => import('./modules/config-center'));

export default function Routes(): JSX.Element {
  return (
    <React.Suspense fallback={<Loading className="w-screen h-screen" desc="加载中..." />}>
      <Switch>
        <Route exact path="/" component={RedirectToApps} />
        <Route path="/test" component={Test} />
        <Route path="/metadata" component={MetaData} />
        <Route path="/access-control" component={AccessControl} />
        <Route path="/system" component={SystemMgmt} />
        <Route path="/apps" component={AppsRoutes} />
        <Route path="/poly/:appID/:polyFullPath+" component={PolyAPI}/>
        <Route path="/config-center" component={ConfigCenter} />
        <Route path="/artery-engine" component={PageDesign} />
        <Route path="/artery-preview" component={PagePreview} />
        <Route component={NotFoundError} />
      </Switch>
    </React.Suspense>
  );
}
