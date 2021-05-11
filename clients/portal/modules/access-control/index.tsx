import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ItemWithTitleDesc from '@c/item-with-title-desc';
import ErrorTips from '@c/error-tips';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';
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
  },
  {
    id: 'role-management',
    icon: 'people',
    name: '角色管理',
    url: '/access-control/role-management',
  },
];

export default function Index() {
  const [{ userInfo }] = usePortalGlobalValue();

  if (!userInfo.authority.includes('accessControl')) {
    return <ErrorTips desc="您没有权限, 请联系管理员..." />;
  }
  return (
    <div className="py-20 px-58 flex justify-center items-start flex-grow "
      style={{ height: 'calc(100vh - 62px)' }} >
      <div className="w-316  rounded-12 mr-20">
        <SideNavCard cardTitle={(
          <div className="access-background-image p-20 opacity-90">
            <ItemWithTitleDesc
              title="访问控制"
              desc="对企业通讯录、角色权限进行统一管理"
              itemRender={
                (<div
                  className="bg-gradient-green-to-top-right
                corner-12-2-12-12 w-48 h-48 flex-initial
                flex items-center justify-center
                "
                >
                  <AppIcon themeColor="teal" size={48} iconName="admin"/>
                </div>)
              }
              titleClassName="text-h4"
              descClassName="text-caption"
            />
          </div>
        )}
        menuData={MENU}
        defaultActiveLink={{ basePath: '/access-control', menuId: 'departments-employees' }}
        />
      </div>
      <Switch>
        <Route exact path="/access-control" component={DepartmentsEmployees} />
        <Route path="/access-control/departments-employees" component={DepartmentsEmployees} />
        <Route path="/access-control/role-management" component={RoleManagement} />
        <Route component={() => (<ErrorTips desc={'Menu page is not found'} />)} />
      </Switch>
    </div>
  );
}
