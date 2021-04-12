import React from 'react';
import { NavLink } from 'react-router-dom';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import Icon from '@c/icon';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
};

export default function ListMenu() {
  const [{ userInfo }] = usePortalGlobalValue();

  const menuData: MenuItem[] = [];

  if (userInfo.authority.includes('accessControl/mailList/read')) {
    menuData.push({
      id: 'departments-employees',
      icon: 'contacts',
      name: '企业通讯录',
    });
  }
  if (userInfo.authority.includes('accessControl/role/read')) {
    menuData.push({
      id: 'role-management',
      icon: 'people',
      name: '角色管理',
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
              to={`/access-control/${item.id}`}
              exact
              className={twCascade(
                'h-56 rounded-l-8 items-center',
                'pl-18 flex relative cursor-pointer transition-all duration-300',
                useCss({
                  '> span': {
                    color: '#0F172A',
                    'font-weight': 400,
                  },
                  '> .icon': {
                    fill: '#94A3B8',
                  },
                  '> div': {
                    display: 'none',
                  },
                  '&:hover': {
                    'background-color': '#F1F5F9',
                    '> span': {
                      'font-weight': 600,
                    },
                    '> .icon': {
                      fill: '#475569',
                    },
                    '> div': {
                      display: 'block',
                    },
                  },
                })
              )}
              activeClassName={useCss({
                'background-color': '#F1F5F9',
                '> span': {
                  'font-weight': 600,
                },
                '> div': {
                  display: 'block',
                },
                '> .icon': {
                  fill: '#475569',
                },
              })}
              isActive={(match, location) => {
                const { pathname } = location;
                if (item.id === 'departments-employees' &&
                  (pathname === '/access-control' ||
                    pathname === '/access-control/')) {
                  return true;
                }
                return !!match;
              }}
            >
              <Icon
                name={item.icon}
                className="mr-8 icon"
                size={24}
              />
              <span className="text-gray-400 text-h5">{item.name}</span>
              <div
                className={twCascade(
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
