import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Loading from '@c/loading';

import SideNavs from './side-navs';
import AppAdmin from './app-admin';
import AppInfo from './app-info';
import CustomPage from './custom-page';
import DataModels from './data-models';
import PageMenuDesign from './page-menu-design';
import UsersAndPermissions from './users-and-permissions';
import ApiDocument from './api-documentation';
import AppControl from './app-control';

import './index.scss';

const WorkFlows = React.lazy(() => import('../../work-flow-list'));
const OrchestrationAPI = React.lazy(() => import('./orchestration-api'));

function AppDetailsContent(): JSX.Element {
  return (
    <div className='main-content flex'>
      <SideNavs />
      <div className="m-16 flex-1 mb-0 overflow-auto">
        <React.Suspense fallback={<Loading className="w-screen h-screen" desc="加载中..." />}>
          <Switch>
            <Route exact path='/apps/details/:appID/page_setting' component={PageMenuDesign} />
            <Route exact path='/apps/details/:appID/custom_page' component={CustomPage} />
            <Route exact path='/apps/details/:appID/setting_flow' component={WorkFlows} />
            <Route exact path='/apps/details/:appID/data_models' component={DataModels} />
            <Route exact path='/apps/details/:appID/file_api' component={ApiDocument} />
            <Route exact path='/apps/details/:appID/base_info' component={AppInfo} />
            <Route exact path='/apps/details/:appID/app_permission' component={UsersAndPermissions} />
            <Route exact path='/apps/details/:appID/app_manager' component={AppAdmin} />
            <Route exact path='/apps/details/:appID/app_control' component={AppControl} />
            <Route exact path="/apps/details/:appID/orchestration_api" component={OrchestrationAPI} />
          </Switch>
        </React.Suspense>
      </div>
    </div>
  );
}

export default AppDetailsContent;
