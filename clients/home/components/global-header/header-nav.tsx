import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Icon from '@c/icon';

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
    </div>
  );
}
