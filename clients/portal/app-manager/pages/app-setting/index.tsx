import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import BgIcon from '@appC/bg-icon';

import AppInfo from './app-info';
import AppAdmin from './app-admin';

import './index.scss';

type Props = {
  appDetailsStore?: any;
}

function AppSetting({ appDetailsStore }: Props) {
  const { appId } = useParams<any>();

  useEffect(() => {
    appDetailsStore.setAppId(appId);
  }, []);

  const MENU = [
    {
      id: 'info',
      icon: 'description',
      name: '应用信息',
      url: `/apps/${appId}/setting/info`,
    },
    {
      id: 'adminUsers',
      icon: 'admin_panel_settings',
      name: '应用管理员',
      url: `/apps/${appId}/setting/adminUsers`,
    },
  ];

  return (
    <div className="max-w-screen app-entry-container">
      <SideNavCard cardTitle={(
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="应用管理"
            desc="常规的基础设置和工作流编排"
            itemRender={<BgIcon bgColor='fuchsia' iconName='settings' iconSize={32} size={48} />}
            titleClassName="text-2 leading-8 font-bold mb-2"
            descClassName="leading-8"
          />
        </div>
      )} menuData={MENU} />
      <div className="app-right-box bg-white">
        <Switch>
          <Route exact path="/apps/:appId/setting/info" component={AppInfo} />
          <Route exact path="/apps/:appId/setting/adminUsers" component={AppAdmin} />
        </Switch>
      </div>
    </div>
  );
}

export default inject('appDetailsStore')(AppSetting);
