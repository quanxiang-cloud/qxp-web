import React, { forwardRef } from 'react';

import cs from 'classnames';

import { TabItem } from './index';

import './index.scss';

type Props<T extends React.Key> = {
    navs: TabItem<T>[];
    currentKey: string | number;
    strechNavs?: boolean;
    navTitleClassName?: string;
    navsClassName?: string;
    onClick?: (id: T) => void;
}
function TabNavs<T extends React.Key>({
  navs,
  currentKey,
  strechNavs,
  navTitleClassName,
  navsClassName,
  onClick,
}: Props<T>,
ref?: React.Ref<HTMLDivElement>) {
  return (
    <div
      ref={ref}
      className={cs('tab-navs', navsClassName)}
    >
      {
        navs.map((item) => {
          const active = item.id == currentKey;
          return (
            <div
              key={item.id}
              onClick={() => onClick?.(item.id)}
              className={cs('tab-nav-item', navTitleClassName, {
                active: active,
                'strech-navs': strechNavs,
                'text-blue-600': active,
                'font-semibold': active,
                'text-gray-600': !active,
              })}
            >
              {item.name}
            </div>
          );
        })
      }
    </div>
  );
}

export default forwardRef(TabNavs);
