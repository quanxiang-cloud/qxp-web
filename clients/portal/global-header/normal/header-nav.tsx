import React from 'react';
import { Location } from 'history';

import Authorized from '@c/authorized';

import NavButton from '../nav-button';

interface Props {
  location: Location;
}

export default function HeaderLeft({ location }: Props) {
  const isHome = location.pathname === '/';
  const isAppManagement = location.pathname === '/apps-management';
  const isAccess = [
    '/access-control',
    '/access-control/',
    '/access-control/departments-employees',
    '/access-control/role-management',
  ].includes(location.pathname);
  const isSystemControl = location.pathname === '/system/message';

  return (
    <div className="flex items-center flex-2">
      <NavButton
        to="/"
        className="mr-12"
        iconName="add_task"
        isActive={isHome}
        text="工作台"
      />
      <NavButton
        to="/apps-management"
        iconName="dashboard_customize"
        isActive={isAppManagement}
        text="应用管理"
      />
      <Authorized authority={['accessControl']}>
        <NavButton
          to="/access-control"
          iconName="admin_panel_settings"
          isActive={isAccess}
          text="访问控制"
        />
      </Authorized>
      <NavButton
        to="/system/message"
        iconName="system_management"
        isActive={isSystemControl}
        text="系统管理"
      />
    </div>
  );
}
