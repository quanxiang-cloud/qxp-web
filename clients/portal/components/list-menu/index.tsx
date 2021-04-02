import React, { useState } from 'react';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';

type MenuItem = {
  id: string;
  name: string;
  icon: string;
};

export interface Props {
  menuData: MenuItem[];
  onChange: (type: string) => void;
  defaultType?: string;
}

export default function ListMenu({ onChange, defaultType, menuData }: Props) {
  const [type, setType] = useState<string | undefined>(defaultType);

  return (
    <ul className="w-auto">
      {menuData.map(({ id, name, icon }) => {
        return (
          <li
            key={id}
            onClick={() => {
              setType(id);
              onChange(id);
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
                ...(type === id ?
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
            <img className="w-24 h-24 pr-8" src={require(`../../../assets/images/${icon}.svg`)} alt="logo" />
            <span className="text-gray-400 text-16">{name}</span>
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
