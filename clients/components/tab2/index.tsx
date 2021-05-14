import React, { useState, useRef, useEffect } from 'react';

import TabNavs from './tab-navs';

import cs from 'classnames';

import './index.scss';

export type TabItem<T extends React.Key = string> = {
  id: T;
  name: string;
  content: React.ReactNode;
}

export type Props<T extends React.Key>= {
  items: TabItem<T>[];
  strechNavs?: boolean
  className?: string;
  navsClassName?: string;
  navTitleClassName?: string;
  contentClassName?: string;
  style?: Record<string, unknown>;
  currentKey?: string | number;
  onChange?: (key: T) => void;
}

export default function Tab<T extends React.Key>({
  items,
  style,
  className,
  navsClassName,
  navTitleClassName,
  contentClassName,
  strechNavs = false,
  currentKey,
  onChange,
}: Props<T>) {
  const navsRef = useRef(null);
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);
  const [height, setHeight] = useState<string>('39px');

  useEffect(() => {
    setHeight((navsRef.current as unknown as HTMLDivElement)?.offsetHeight);
  }, []);

  const tabContentRender = (items: TabItem<T>[], key: string | number) => {
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

  const handleNavItemClick = (id: any) => {
    setKey(id);
    onChange?.(id);
  };

  return (
    <div
      style={style}
      className={cs('tab-wrapper', className)}
    >
      <TabNavs
        ref={navsRef}
        navs={items}
        currentKey={key}
        strechNavs={strechNavs}
        navsClassName={navsClassName}
        navTitleClassName={navTitleClassName}
        onClick={handleNavItemClick}
      />
      <div
        style={{ height: `calc(100% - ${height})px` }}
        className={cs('tab-content', contentClassName)}
      >
        {tabContentRender(items, key)}
      </div>
    </div>
  );
}

Tab.TabNavs = TabNavs;
