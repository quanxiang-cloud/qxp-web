import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFoundError from '@c/404-error';

import Header from './header';
import SideNavs from './side-navs';
import AppAdmin from './app-admin';
import AppInfo from './app-info';
import CustomPage from './custom-page';
import DataModels from './data-models';
import PageMenuDesign from './page-menu-design';
import UsersAndPermissions from './users-and-permissions';
import ApiDocument from './api-documentation';
import WorkFlows from '../../work-flow-list';
import AppControl from './app-control';

import './index.scss';

function AppDetailsContent(): JSX.Element {
  return (
    <>
      <Header />
      <div className='main-content flex'>
        <SideNavs />
        <div className="m-16 flex-1 mb-0 overflow-auto">
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
            <Route
              component={() =>
                (<NotFoundError url='/apps' classnames='h-full'/>)
              }
            />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default AppDetailsContent;
