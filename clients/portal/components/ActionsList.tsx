import React from 'react';
import useCss from 'react-use/lib/useCss';
import classnames from 'classnames';
import { twCascade } from '@mariusmarais/tailwind-cascade';

export type IActionListItem<T> = {
  id: string;
  iconName: string;
  text: string;
  onclick?: (params?: Partial<T> | T) => void;
};

interface IActionsList<T> {
  actions: IActionListItem<T>[];
  params?: Partial<T> | T;
  className?: string;
}

export const ActionsList = function <T>({ actions, params, className }: IActionsList<T>) {
  return (
    <div
      className={twCascade(
        'min-w-24 z-10 py-dot-8 shadow-title bg-white rounded-dot-6 absolute top-1-dot-6 right-0',
        className,
      )}
    >
      <ul className="flex flex-col items-center">
        {actions.map((action) => {
          if (!action) {
            return null;
          }
          return (
            <li
              key={action.id}
              onClick={() => {
                action.onclick && action.onclick(params);
              }}
              className={classnames(
                'w-full h-1-dot-9 px-dot-8 flex items-center cursor-pointer',
                useCss({
                  '&:hover': {
                    'background-color': '#F0F6FF',
                  },
                }),
              )}
            >
              {action.iconName && (
                <img
                  className="w-1-dot-2 h-1-dot-2 pr-dot-4"
                  src={
                    action.iconName.includes('/')
                      ? action.iconName
                      : `/dist/images/${action.iconName}`
                  }
                  alt="logo"
                />
              )}
              <div className="text-dot-7 whitespace-no-wrap">{action.text}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
