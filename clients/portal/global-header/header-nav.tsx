import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import SvgIcon from '@c/icon';
import Authorized from '@clients/components/authorized';

export default function HeaderLeft() {
  const location = useLocation();

  function className(condition: boolean) {
    if (condition) {
      return {
        'bg-blue-100': condition,
      };
    }
  }

  function style(condition: boolean) {
    if (condition) {
      return {
        color: 'var(--blue-600)',
      };
    }
    return {};
  }

  const isHome = location.pathname === '/';
  const isAppManagement = location.pathname === '/app-management';
  const isAccess = [
    '/access-control',
    '/access-control/',
    '/access-control/role-management',
  ].includes(location.pathname);
  const isSystemControl = location.pathname === '/system';

  return (
    <div className="flex items-center flex-2">
      <Link
        to="/"
        className={twCascade(
          'header-nav-btn group mr-12',
          className(isHome)
        )}
      >
        <div className="header-nav-btn-icon-wrapper">
          <SvgIcon
            name="add_task"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
            style={style(isHome)}
          />
        </div>
        <span
          className="header-nav-btn-text group-hover:text-blue-600"
          style={style(isHome)}
        >
          工作台
        </span>
      </Link>
      <Link
        to="/app-management"
        className={twCascade(
          'header-nav-btn group mr-20',
          className(isAppManagement)
        )}
      >
        <div className="header-nav-btn-icon-wrapper">
          <SvgIcon
            name="dashboard_customize"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            style={style(isAppManagement)}
            size={20}
          />
        </div>
        <span
          className="header-nav-btn-text group-hover:text-blue-600"
          style={style(isAppManagement)}
        >
              应用管理
        </span>
      </Link>
      <Authorized authority={['accessControl']}>
        <Link
          to="/access-control"
          className={twCascade(
            'header-nav-btn group mr-20',
            className(isAccess)
          )}
        >
          <div className="header-nav-btn-icon-wrapper">
            <SvgIcon
              name="admin_panel_settings"
              className="group-hover:text-blue-600 header-nav-btn-icon"
              style={style(isAccess)}
              size={20}
            />
          </div>
          <span
            className="header-nav-btn-text group-hover:text-blue-600"
            style={style(isAccess)}
          >
                访问控制
          </span>
        </Link>
      </Authorized>
      <Link
        to="/system"
        className={twCascade(
          'header-nav-btn group mr-20',
          className(isSystemControl)
        )}
      >
        <div className="header-nav-btn-icon-wrapper">
          <SvgIcon
            name="system_management"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
            style={style(isSystemControl)}
          />
        </div>
        <span
          className="header-nav-btn-text group-hover:text-blue-600"
          style={style(isSystemControl)}
        >
              系统管理
        </span>
      </Link>
    </div>
  );
}
