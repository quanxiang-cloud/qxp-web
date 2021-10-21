import React, { forwardRef } from 'react';

import cs from 'classnames';

import { TabItem } from './index';

import './index.scss';

type Props<T extends React.Key> = {
  navs: TabItem<T>[];
  currentKey: string | number;
  strechNavs?: boolean;
  separator?: boolean;
  navTitleClassName?: string;
  navsClassName?: string;
  onClick?: (id: T) => void;
}
function TabNavs<T extends React.Key>({
  navs,
  currentKey,
  strechNavs,
  separator,
  navTitleClassName,
  navsClassName,
  onClick,
}: Props<T>,
ref?: React.Ref<HTMLDivElement>): JSX.Element {
  return (
    <div className='z-10'> {/* This layer of div is used to solve the overflow-x auto */}
      <div
        ref={ref}
        className={cs('tab-navs', navsClassName)}>
        {
          navs.map((item) => {
            const active = item.id === currentKey;
            return (
              <div
                key={item.id}
                onClick={() => onClick?.(item.id)}
                className={cs('tab-nav-item', navTitleClassName, {
                  active: active,
                  'tab-nav-item-separator': separator,
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
    </div>
  );
}

export default forwardRef(TabNavs);
