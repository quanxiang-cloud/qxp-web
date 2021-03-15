import React, { useState } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

export interface ITabItem {
  id: string | number;
  name: string;
  content: JSX.Element;
}

export interface ITab {
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  items: ITabItem[];
  currentKey?: string | number;
  onChange?: (key: string | number) => void;
}

export const Tab = ({
  className,
  headerClassName,
  contentClassName,
  items,
  currentKey,
  onChange = () => {},
}: ITab) => {
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);

  return (
    <div className={twCascade('transition duration-300 overflow-hidden', className)}>
      <header className={twCascade('flex flex-row overflow-x-scroll w-full', headerClassName)}>
        {items.map((item) => {
          const active = item.id == key;
          return (
            <div
              key={item.id}
              className={twCascade(
                'whitespace-nowrap rounded-dot4 rounded-br-none rounded-bl-none py-1',
                'px-dot-8 cursor-pointer text-dot-7 hover:bg-blue-light',
                'hover:text-blue-primary transition duration-300',
                {
                  'bg-blue-light': active,
                  'text-blue-primary': active,
                  'font-bold': active,
                },
                contentClassName,
              )}
              onClick={() => {
                setKey(item.id);
                onChange(item.id);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </header>
      <div
        className="w-full bg-blue-light px-4 py-dot-8 overflow-hidden"
        style={{
          height: 'calc(100% - 34px)',
        }}
      >
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className={twCascade(
                item.id === key
                  ? 'opacity-100 h-full visible pointer-events-auto'
                  : 'opacity-0 h-0 invisible pointer-events-none',
                'transition-opacity overflow-hidden',
              )}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
