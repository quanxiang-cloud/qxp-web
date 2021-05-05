import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import Breadcrumb from '@c/breadcrumb';
import AppIcon from '@c/app-icon';
import Icon from '@c/icon';

import AppInfo from './app-info';
import AppAdmin from './app-admin';
import appDetailsStore from '../store';

const workflows = React.lazy(() => import('../../../work-flow/list'));

import './index.scss';

function AppSetting() {
  const { appId } = useParams<any>();
  const history = useHistory();

  const goBack = () => {
    history.push('/apps/details/' + appId);
  };

  const MENU = [
    {
      id: 'info',
      icon: 'description',
      replace: true,
      name: '应用信息',
      url: `/apps/details/${appId}/setting/info`,
    },
    {
      id: 'adminUsers',
      icon: 'admin_panel_settings',
      replace: true,
      name: '应用管理员',
      url: `/apps/details/${appId}/setting/adminUsers`,
    },
  ];

  return (
    <div className='max-w-screen app-setting-container'>
      <div className='mb-16'>
        <Breadcrumb className='flex items-center'>
          <Breadcrumb.Item>
            <a>
              <Icon size={23} name='reply' />
              <span onClick={goBack}>{appDetailsStore.appDetails.appName}</span>
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            应用管理
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="flex justify-center items-start gap-x-20 flex-1">
        <SideNavCard cardTitle={(
          <div className="access-background-image p-20 opacity-90">
            <ItemWithTitleDesc
              title="应用管理"
              desc="常规的基础设置和工作流编排"
              itemRender={<AppIcon themeColor='fuchsia' iconName='settings' size={48} />}
              titleClassName="text-2 leading-8 font-bold mb-2"
              descClassName="leading-8"
            />
          </div>
        )} menuData={MENU} />
        <div className="app-right-box bg-white">
          <Switch>
            <Route exact path="/apps/details/:appId/setting/info" component={AppInfo} />
            <Route exact path="/apps/details/:appId/setting/adminUsers" component={AppAdmin} />
            <Route path="/apps/details/:appId/setting/workflows" component={workflows} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default observer(AppSetting);
