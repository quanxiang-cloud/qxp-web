import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import { isEmpty } from 'lodash';

import Loading from '@c/loading';
import NotFoundError from '@c/404-error';
// import { getNestedPropertyToArray } from '@lib/utils';

import AppsRoutes from './modules/apps-management/routes';
import RedirectToApps from './modules/dashboard/redirect-to-apps';
import PageDesign from './modules/apps-management/pages/page-design';
import PagePreview from './modules/apps-management/pages/page-design/page-preview';

const MetaData = React.lazy(() => import('./modules/metadata'));
const AccessControl = React.lazy(() => import('./modules/access-control'));
const SystemMgmt = React.lazy(() => import('./modules/system-mgmt'));
const PolyAPI = React.lazy(() => import('./modules/poly-api'));
const ConfigCenter = React.lazy(() => import('./modules/config-center'));

// const { USER } = window;
// if (USER && !isEmpty(USER)) {
//   USER.depIds = getNestedPropertyToArray<string>(USER?.dep, 'id', 'child');
// }

export default function Routes(): JSX.Element {
  return (
    <React.Suspense fallback={<Loading className="w-screen h-screen" desc="加载中..." />}>
      <Switch>
        <Route exact path="/" component={RedirectToApps} />
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
