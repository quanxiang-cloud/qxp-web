import React from 'react';
import { NavLink } from 'react-router-dom';
import Authorized from '@c/authorized';

import Icon from '@c/icon';

import './index.scss';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
  url: string;
  authority: string;
};

type defaultActive = {
  basePath: string;
  menuId: string
}

type Props = {
  menuData: MenuItem[];
  cardTitle?: string | React.ReactNode;
  className?: string;
  defaultActiveLink?: defaultActive
}

export default function SideNavCard({
  menuData,
  cardTitle,
  className = '',
  defaultActiveLink,
}: Props) {
  return (
    <div className={`bg-white rounded-12 ${className}`}>
      {cardTitle ? cardTitle : null}
      <div className="px-20 py-16">
        <ul className="w-auto">
          {menuData.map(({ id, icon, name, url, authority }) => {
            return (
              <Authorized key={id} authority={[authority]}>
                <li>
                  <NavLink
                    to={url}
                    className='side-nav-link rounded-l-8 transition-all duration-300'
                    activeClassName='side-nav-link-active'
                    isActive={(match, location) => {
                      const { pathname } = location;
                      if (defaultActiveLink) {
                        if (url === `${defaultActiveLink.basePath}/${defaultActiveLink.menuId}` &&
                        (pathname === defaultActiveLink.basePath ||
                          pathname === `${defaultActiveLink.basePath}/`)) {
                          return true;
                        }
                      }
                      return !!match;
                    }}
                  >
                    <Icon className='mr-8' size={24} name={icon} />
                    <span className='text-gray-400 text-h5'>{name}</span>
                    <div className='side-nav-link-active-bar bg-gray-600 rounded-l-8'></div>
                  </NavLink>
                </li>
              </Authorized>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
