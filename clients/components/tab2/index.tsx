import React, { useState, useRef, useEffect } from 'react';

import cs from 'classnames';

import './index.scss';

export interface TabItem {
  id: string | number;
  name: string;
  content: React.ReactNode;
}

export interface Props {
  items: TabItem[];
  strechNavs?: boolean
  className?: string;
  navsClassName?: string;
  navTitleClassName?: string;
  contentClassName?: string;
  style?: Record<string, unknown>;
  currentKey?: string | number;
  onChange?: (key: string | number) => void;
}

export default function Tab({
  items,
  style,
  className,
  navsClassName,
  navTitleClassName,
  contentClassName,
  strechNavs = false,
  currentKey,
  onChange = () => { },
}: Props) {
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);
  const [height, setHeight] = useState<string>('39px');
  const navsRef = useRef(null);

  useEffect(() => {
    setHeight((navsRef.current as unknown as HTMLDivElement)?.style.height);
  }, []);

  const tabNavRender = (items: TabItem[], key: string | number) => {
    return (
      items.map((item) => {
        const active = item.id == key;
        return (
          <div
            key={item.id}
            className={cs(
              'tab-nav-item',
              strechNavs && 'strech-navs',
              active && 'active',
              {
                'text-blue-600': active,
                'font-semibold': active,
                'text-gray-600': !active,
              },
              navTitleClassName,
            )}
            onClick={() => {
              setKey(item.id);
              onChange(item.id);
            }}
          >
            {item.name}
          </div>
        );
      })
    );
  };

  const tabContentRender = (items: TabItem[], key: string | number) => {
    return items.map((item) => {
      return (
        <div
          key={item.id}
          className={
            cs(item.id === key && 'show', 'tab-content-item')
          }
        >
          {item.content}
        </div>
      );
    });
  };

  return (
    <div
      style={style}
      className={cs('tab-warpper', className)}
    >
      <div
        ref={navsRef}
        className={cs('tab-navs', navsClassName)}
      >
        {tabNavRender(items, key)}
      </div>
      <div
        style={{ height: `calc(100% - ${height})` }}
        className={cs('tab-content', contentClassName)}
      >
        {tabContentRender(items, key)}
      </div>
    </div>
  );
}
