import React, { useState, useRef, useEffect } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

export interface ITabItem {
  id: string | number;
  name: string;
  content: JSX.Element;
}

export interface ITab {
  className?: string;
  headerClassName?: string;
  activeTitleClassName?: string;
  contentClassName?: string;
  items: ITabItem[];
  currentKey?: string | number;
  onChange?: (key: string | number) => void;
  style?: Record<string, unknown>;
  titleClassName?: string;
}

export default function Tab({
  className,
  headerClassName,
  activeTitleClassName,
  titleClassName,
  contentClassName,
  items,
  currentKey,
  onChange = () => {},
  style,
}: ITab) {
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);
  const [height, setHeight] = useState<string>('34px');
  const headerRef = useRef(null);

  useEffect(() => {
    setHeight((headerRef.current as unknown as HTMLDivElement)?.style.height);
  }, []);

  return (
    <div style={style} className={twCascade('transition duration-300', className)}>
      <header className={twCascade('flex flex-row w-full', headerClassName)} ref={headerRef}>
        {items.map((item) => {
          const active = item.id == key;
          return (
            <div
              key={item.id}
              className={twCascade(
                'whitespace-nowrap py-5 tab-border',
                'px-16 cursor-pointer text-body2-no-color hover:bg-blue-100',
                'hover:text-blue-600 transition duration-300',
                {
                  'bg-blue-100': active,
                  'text-blue-600': active,
                  'font-semibold': active,
                  'text-gray-600': !active,
                  ...(activeTitleClassName ? {
                    [activeTitleClassName]: active,
                  } : {}),
                },
                titleClassName,
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
        className={
          twCascade(
            'w-full bg-blue-100 px-20 py-16',
            contentClassName,
            contentClassName?.includes('overflow') ? '' : 'overflow-hidden'
          )
        }
        style={{
          height: `calc(100% - ${height})`,
        }}
      >
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className={twCascade(
                item.id === key ?
                  'opacity-100 h-full visible overflow-auto pointer-events-auto' :
                  'opacity-0 h-0 hidden pointer-events-none',
                'transition-opacity',
              )}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
