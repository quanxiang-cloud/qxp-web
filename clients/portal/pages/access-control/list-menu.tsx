import React from 'react';
import { NavLink } from 'react-router-dom';

import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { usePortalGlobalValue } from '@clients/common/state/portal';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
};

export const ListMenu = () => {
  const [{ userInfo }] = usePortalGlobalValue();

  const menuData: MenuItem[] = [];

  if (userInfo.authority.includes('accessControl/mailList/read')) {
    menuData.push({
      id: 'corporate-directory',
      icon: '/dist/images/user.svg',
      name: '企业通讯录',
    });
  }
  if (userInfo.authority.includes('accessControl/role/read')) {
    menuData.push({
      id: 'role-management',
      icon: '/dist/images/role.svg',
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
              className={twCascade(
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
                })
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
              // When /access and /access/corporate-directory are matched, NavLink is activated
              isActive={(match, location) => {
                const { pathname } = location;
                if (item.id === 'corporate-directory') {
                  if (match || pathname === '/access-control' || pathname === '/access-control/') {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  if (match) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }}
            >
              <img className="w-24 h-24 pr-8" src={item.icon} alt="logo" />
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
};
