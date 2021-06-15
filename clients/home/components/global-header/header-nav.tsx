import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import cs from 'classnames';

import Icon from '@c/icon';

export default function HeaderLeft() {
  const location = useLocation();

  function style(condition: boolean) {
    if (condition) {
      return {
        color: 'var(--gray-600)',
      };
    }
    return { color: 'var(--gray-400)' };
  }

  const isHome = location.pathname === '/';

  return (
    <div className="flex items-center flex-2">
      <Link
        to="/"
        className={cs(
          'header-nav-btn group mr-20',
        )}
      >
        <div className="header-nav-btn-icon-wrapper">
          <Icon
            name="home_add_task"
            className="group-hover:text-gray-600 header-nav-btn-icon"
            size={20}
            style={style(isHome)}
          />
        </div>
        <span
          className="header-nav-btn-text group-hover:text-gray-600"
          style={style(isHome)}
        >
          工作台
        </span>
      </Link>
    </div>
  );
}
