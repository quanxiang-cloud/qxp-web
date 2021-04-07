import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ListMenu from '@c/list-menu';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import Icon from '@c/icon';

import MyApp from './my-app';

import './index.scss';

const MENU = [
  {
    id: 'MyApp',
    icon: 'dashboard_customize',
    name: '我的应用',
    url: '/appManager/list'
  },
  // {
  //   id: 'PlatformSetting',
  //   icon: 'theme',
  //   name: '平台设置',
  // },
];

function AppManagerEntry() {

  return (
    <div className="max-w-screen px-5-dot-8 app-entry-container">
      <div className="w-31-dot-6 bg-white rounded-12">
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="应用管理"
            desc="对企业的自建应用进行统一管理"
            itemRender={
              (<div
                className="icon-border-radius bg-gradient-amber
                rounded-lg rounded-tr-none w-48 h-48 flex-initial
                flex items-center justify-center
                "
              >
                <Icon name='dashboard_customize' type='light' size={24} />
              </div>)
            }
            titleClassName="text-2 leading-8 font-bold mb-2"
            descClassName="leading-8"
          />
        </div>
        <div className="p-20 pb-40">
          <ListMenu defaultType="MyApp" menuData={MENU} />
        </div>
      </div>
      <div className="app-right-box">
        <Switch>
          <Route exact path="/appManager/list" component={MyApp} />
        </Switch>
      </div>
    </div>
  );
}

export default AppManagerEntry;
