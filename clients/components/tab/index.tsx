import React, { useState, useRef, useEffect } from 'react';

import TabNavs from './tab-navs';

import cs from 'classnames';

import './index.scss';

export type TabItem<T extends React.Key = string> = {
  id: T;
  name: string;
  content: React.ReactNode;
}

export type Props<T extends React.Key> = {
  items: TabItem<T>[];
  strechNavs?: boolean;
  separator?: boolean;
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
  strechNavs,
  separator,
  currentKey,
  onChange,
}: Props<T>): JSX.Element {
  const navsRef = useRef(null);
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);

  useEffect(()=> {
    setKey(currentKey || items[0].id);
  }, [currentKey]);

  const tabContentRender = (items: TabItem<T>[], key: string | number): React.ReactNode => {
    return items.find((item) => item.id === key)?.content;
  };

  const handleNavItemClick = (id: any): void => {
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
        separator={separator}
        navsClassName={navsClassName}
        navTitleClassName={navTitleClassName}
        onClick={handleNavItemClick}
      />
      <div
        className={cs('tab-content', contentClassName)}
      >
        {tabContentRender(items, key)}
      </div>
    </div>
  );
}

Tab.TabNavs = TabNavs;
