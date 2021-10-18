import React from 'react';
import cs from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import Icon from '@c/icon';

export default function HeaderLeft(): JSX.Element {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Link to="/" className="flex-2">
      <div className="w-100 group">
        <div
          className={cs('mr-20 p-6 flex items-center group-hover:bg-blue-500 rounded-8 rounded-tr-2', {
            'text-gray-50': isHome,
            'text-blue-300 group-hover:text-gray-50': !isHome,
          })}
        >
          <Icon
            name="home_add_task"
            className="text-current"
            size={20}
          />
          <span className="text-inherit ml-4">工作台</span>
        </div>
      </div>
    </Link>
  );
}
