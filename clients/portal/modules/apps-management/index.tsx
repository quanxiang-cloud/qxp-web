import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AppIcon from '@c/app-icon';
import NotFoundError from '@c/404-error';
import SideNavCard from '@c/side-nav-card';
import ItemWithTitleDesc from '@c/item-with-title-desc';

import OptionSet from '../option-set';
import AppTemplates from './pages/entry/app-templates';
import AppList from './pages/entry/app-list';

const MENU = [
  {
    id: 'my-apps',
    icon: 'dashboard_customize',
    name: '我的应用',
    url: '/apps/my-apps',
    authority: 'application/read',
  },
  {
    id: 'option-set',
    icon: 'option-set',
    name: '选项集',
    url: '/apps/option-set',
    authority: 'dataset/read',
  },
  {
    id: 'app-templates',
    icon: 'template',
    name: '模版库',
    url: '/apps/app-templates',
    authority: 'application/read',
  },
];

function AppManagerEntry(): JSX.Element {
  return (
    <div className="app-entry-container main-content">
      <SideNavCard
        className='w-280'
        cardTitle={(
          <div className="access-background-image p-20 opacity-90">
            <ItemWithTitleDesc
              title="应用管理"
              desc="对企业的自建应用进行统一管理"
              itemRender={(
                <AppIcon themeColor='amber' iconName='dashboard_customize' size={48} />
              )}
              titleClassName="text-h4"
              descClassName="text-caption"
            />
          </div>
        )}
        menuData={MENU}
        defaultActiveLink={{ basePath: '/apps', menuId: 'my-apps' }}
      />
      <div className="app-right-box">
        <Switch>
          <Route exact path="/apps" component={AppList} />
          <Route path="/apps/my-apps" component={AppList} />
          <Route path="/apps/option-set" component={OptionSet} />
          <Route path="/apps/app-templates" component={AppTemplates} />
          <Route component={NotFoundError}/>
        </Switch>
      </div>
    </div>
  );
}

export default AppManagerEntry;
