import React, { useState, useEffect } from 'react';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
};

export interface IListMenu {
  menuData?: MenuItem[];
  onChange: (type: string) => void;
  defaultType?: string;
}

export const ListMenu = ({ onChange, defaultType }: IListMenu) => {
  const [type, setType] = useState<string | undefined>(defaultType);
  const menuData: MenuItem[] = [
    {
      id: 'corporateDirectory',
      icon: '/dist/images/user.svg',
      name: '企业通讯录',
    },
    {
      id: 'RoleManagement',
      icon: '/dist/images/role.svg',
      name: '角色管理',
    },
  ];

  return (
    <ul className="w-auto">
      {menuData.map((item) => {
        return (
          <li
            key={item.id}
            onClick={() => {
              setType(item.id);
              onChange(item.id);
            }}
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
                ...(type === item.id ?
                  {
                    'background-color': '#F1F5F9',
                    '> span': {
                      color: '#0F172A',
                      'font-weight': 600,
                    },
                    '> div': {
                      display: 'block',
                    },
                  } :
                  {}),
              }),
            )}
          >
            <img className="w-24 h-24 pr-8" src={item.icon} alt="logo" />
            <span className="text-gray-400 text-16">{item.name}</span>
            <div
              className={twCascade(
                'absolute top-0 right-0 w-4 h-56 bg-gray-600',
                'rounded-l-8 transition-all duration-300',
              )}
            ></div>
          </li>
        );
      })}
    </ul>
  );
};
