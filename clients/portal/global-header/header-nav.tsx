import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import Icon from '@c/icon';

export default function HeaderLeft(): JSX.Element {
  const location = useLocation();

  return (
    <div className="flex items-center flex-2 my-10">
      {/* <NavLink
        to="/"
        activeClassName="global-header-nav--active"
        isActive={() => location.pathname === '/'}
        className="global-header-nav"
      >
        <Icon name="add_task" className="mr-4" size={20} />
        工作台
      </NavLink> */}
      <NavLink
        to="/apps"
        activeClassName="global-header-nav--active"
        className="global-header-nav"
        isActive={() => location.pathname.startsWith('/apps')}
      >
        <Icon name="dashboard_customize" className="mr-4" size={20} />
        应用管理
      </NavLink>
      <NavLink
        to="/access-control"
        activeClassName="global-header-nav--active"
        className="global-header-nav"
        isActive={() => location.pathname.startsWith('/access-control')}
      >
        <Icon name="admin_panel_settings" className="mr-4" size={20} />
        访问控制
      </NavLink>
      <NavLink
        to="/system"
        activeClassName="global-header-nav--active"
        className="global-header-nav"
        isActive={() => location.pathname.startsWith('/system')}
      >
        <Icon name="system_management" className="mr-4" size={20} />
        系统管理
      </NavLink>
    </div>
  );
}
