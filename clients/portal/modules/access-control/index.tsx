import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ItemWithTitleDesc from '@c/item-with-title-desc';
import ErrorTips from '@c/error-tips';
import SideNavCard from '@c/side-nav-card';
import AppIcon from '@c/app-icon';

import RoleManagement from './role-management';
import DepartmentsEmployees from './departments-employees';

const MENU = [
  {
    id: 'departments-employees',
    icon: 'contacts',
    name: '企业通讯录',
    url: '/access-control/departments-employees',
    authority: 'accessControl/mailList/read',
  },
  {
    id: 'role-management',
    icon: 'people',
    name: '角色管理',
    url: '/access-control/role-management',
    authority: 'accessControl/role/read',
  },
];

export default function Index(): JSX.Element {
  if (!window.ADMIN_USER_FUNC_TAGS.includes('accessControl')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="您没有权限, 请联系管理员..."
      />
    );
  }
  return (
    <div className="app-entry-container">
      <SideNavCard
        className='w-280'
        cardTitle={(
          <div className="access-background-image p-20 opacity-90">
            <ItemWithTitleDesc
              title="访问控制"
              desc="管理端的访问权限控制"
              itemRender={
                (<AppIcon themeColor="teal" size={48} iconName="admin"/>)
              }
              titleClassName="text-h4"
              descClassName="text-caption"
            />
          </div>
        )}
        menuData={MENU}
        defaultActiveLink={{ basePath: '/access-control', menuId: 'departments-employees' }}
      />
      <div className="app-right-box">
        <Switch>
          <Route exact path="/access-control" component={DepartmentsEmployees} />
          <Route path="/access-control/departments-employees" component={DepartmentsEmployees} />
          <Route path="/access-control/role-management" component={RoleManagement} />
          <Route component={(): JSX.Element => (<ErrorTips desc={'Menu page is not found'} />)} />
        </Switch>
      </div>
    </div>
  );
}
