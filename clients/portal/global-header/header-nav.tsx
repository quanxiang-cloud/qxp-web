import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Icon from '@c/icon';
import Authorized from '@c/authorized';

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
  const isAppManagement = location.pathname === '/apps/list';

  const isAccess = [
    '/access-control',
    '/access-control/',
    '/access-control/departments-employees',
    '/access-control/role-management',
  ].includes(location.pathname);
  const isSystemControl = [
    '/system',
    '/system/',
    '/system/message',
    '/system/message/',
    '/system/message/send',
    '/system/message/send/',
  ].includes(location.pathname);
  return (
    <div className="flex items-center flex-2">
      <Link
        to="/"
        className={twCascade(
          'header-nav-btn group mr-20',
          className(isHome)
        )}
      >
        <div className="header-nav-btn-icon-wrapper">
          <Icon
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
        to="/apps/list"
        className={twCascade(
          'header-nav-btn group mr-20',
          className(isAppManagement)
        )}
      >
        <div className="header-nav-btn-icon-wrapper">
          <Icon
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
            <Icon
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
          <Icon
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
