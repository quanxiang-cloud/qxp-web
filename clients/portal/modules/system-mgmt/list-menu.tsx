import React from 'react';
import { NavLink } from 'react-router-dom';
import useCss from 'react-use/lib/useCss';
import cs from 'classnames';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
};

export default function ListMenu(): JSX.Element {
  const menuData: MenuItem[] = [];

  if (window.ADMIN_USER_FUNC_TAGS.includes('platform')) {
    menuData.push({
      id: 'message',
      icon: '/dist/images/bell.svg',
      name: '消息管理',
    });
  }

  return (
    <ul className="w-auto">
      {menuData.map((item) => {
        return (
          <li
            key={item.id}
          >
            <NavLink
              to={`/system/${item.id}`}
              exact
              className={cs(
                'h-56 rounded-l-8 items-center',
                'pl-18 flex relative cursor-pointer transition-all duration-300',
                useCss({
                  '> div': {
                    display: 'none',
                  },
                  '&:hover': {
                    'background-color': '#F1F5F9',
                    '> span': {
                      color: '#0F172A',
                    },
                    '> div': {
                      display: 'block',
                    },
                  },
                }),
              )}
              activeClassName={useCss({
                'background-color': '#F1F5F9',
                '> span': {
                  color: '#0F172A',
                  'font-weight': 600,
                },
                '> div': {
                  display: 'block',
                },
              })}
            >
              <img className="w-24 h-24 mr-8" src={item.icon} />
              <span className="text-gray-400 text-h5">{item.name}</span>
              <div
                className={cs(
                  'absolute top-0 right-0 w-4 h-56 bg-gray-600',
                  'rounded-l-8 transition-all duration-300',
                )}
              ></div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
