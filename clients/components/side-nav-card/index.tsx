import React from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '@c/icon';

import './index.scss';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

type Props = {
  menuData: MenuItem[];
  cardTitle?: string | React.ReactNode;
  className?: string;
}

export default function SideNavCard({ menuData, cardTitle, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-12 ${className}`}>
      {cardTitle ? cardTitle : null}
      <div className="p-20">
        <ul className="w-auto">
          {menuData.map(({ id, icon, name, url }) => {
            return (
              <li key={id}>
                <NavLink
                  to={url}
                  exact
                  className='side-nav-link rounded-l-8 transition-all duration-300'
                  activeClassName='side-nav-link-active'
                >
                  <Icon className='mr-8' size={24} name={icon} />
                  <span className='text-gray-400 text-h5'>{name}</span>
                  <div className='side-nav-link-active-bar bg-gray-600 rounded-l-8'></div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
