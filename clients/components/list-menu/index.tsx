import React from 'react';
import { NavLink } from 'react-router-dom';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Icon from '../icon';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

type Props = {
  menuData: MenuItem[];
}

export default function ListMenu({ menuData }: Props) {

  return (
    <ul className="w-auto">
      {menuData.map(({ id, icon, name, url }) => {
        return (
          <li
            key={id}
          >
            <NavLink
              to={url}
              exact
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
            >
              <Icon className='mr-8' size={24} name={icon} />
              <span className='text-gray-400 text-h5'>{name}</span>
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
