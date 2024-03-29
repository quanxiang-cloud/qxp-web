import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import Loading from '@c/loading';
import NotFoundError from '@c/404-error';

import Header from './header';
import SideNavs from './side-navs';
import AppAdmin from './app-admin';
import AppInfo from './app-info';
import DataModels from './data-models';
import AppViewOrchestration from './view-orchestration';
import AppRoles from './roles-and-permissions';
import ApiDocument from './api-documentation';
import FaaS from './faas';
import ApiKey from './api-key';
import LayoutManagement from './view-orchestration/view-layouts';
import NavManagement from './view-orchestration/nav-management';
import VersionDetails from './faas/func/version-details';

import './index.scss';

// const WorkFlows = lazy(() => import('../../work-flow-list'));
const WorkFlows = lazy(() => import('../../new-work-flow-list'));

const ApiProxy = lazy(() => import('./api-proxy'));
const AppControl = lazy(()=> import('./app-control'));
const OrchestrationAPI = React.lazy(() => import('./orchestration-api'));

function AppDetailsContent(): JSX.Element {
  return (
    <>
      <Header />
      <div className='main-content flex'>
        <SideNavs />
        <div className="m-16 flex-1 mb-0 overflow-hidden">
          <React.Suspense fallback={<Loading className="w-screen h-screen" desc="加载中..." />}>
            <Switch>
              <Route exact path='/apps/details/:appID/views' component={AppViewOrchestration} />
              <Route path='/apps/details/:appID/view_layout' component={LayoutManagement} />
              <Route exact path='/apps/details/:appID/app_nav' component={NavManagement} />
              <Route exact path='/apps/details/:appID/setting_flow' component={WorkFlows} />
              <Route exact path='/apps/details/:appID/data_models' component={DataModels} />
              <Route exact path='/apps/details/:appID/file_api' component={ApiDocument} />
              <Route exact path='/apps/details/:appID/key_api' component={ApiKey} />
              <Route exact path='/apps/details/:appID/faas' component={FaaS} />
              <Route exact path='/apps/details/:appID/build_details/:groupID/:funcID/:buildID' component={VersionDetails} />
              <Route exact path='/apps/details/:appID/base_info' component={AppInfo} />
              <Route exact path='/apps/details/:appID/app_permission' component={AppRoles} />
              <Route exact path='/apps/details/:appID/app_manager' component={AppAdmin} />
              <Route exact path='/apps/details/:appID/app_control' component={AppControl} />
              <Route exact path='/apps/details/:appID/api_proxy' component={ApiProxy} />
              <Route exact path="/apps/details/:appID/orchestration_api" component={OrchestrationAPI} />
              <Route
                component={() =>
                  (<NotFoundError url='/apps' classnames='h-full'/>)
                }
              />
            </Switch>
          </React.Suspense>
        </div>
      </div>
    </>
  );
}

export default AppDetailsContent;
