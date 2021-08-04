import React from 'react';
import { Route } from 'react-router-dom';

import './index.scss';
import SideNavs from './side-navs';
import PageMenuDesign from './page-menu-design';

function AppDetailsContent() {
  return (
    <>
      <div className='apps-management-height flex relative'>
        <SideNavs />
        <Route exact path='/apps/details/:appID/page_setting' component={PageMenuDesign} />
        <Route exact path='/apps/details/:appID/custom_page' component={() => null} />
        <Route exact path='/apps/details/:appID/setting_flow' component={() => null} />
        <Route exact path='/apps/details/:appID/data_modal' component={() => null} />
        <Route exact path='/apps/details/:appID/file_api' component={() => null} />
        <Route exact path='/apps/details/:appID/app_baseInfo' component={() => null} />
        <Route exact path='/apps/details/:appID/app_permission' component={() => null} />
        <Route exact path='/apps/details/:appID/app_manager' component={() => null} />
      </div>
    </>
  );
}

export default AppDetailsContent;
