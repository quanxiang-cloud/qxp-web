import React from 'react';
import { isObject } from 'lodash';

import { isFunction } from '@lib/utils';
import cs from 'classnames';

import Icon from './icon';

export interface IItem<T> {
  id: string;
  iconName: string;
  text: string;
  onclick?: (params?: T) => void;
}

export type IITems<T> = JSX.Element[] | (() => JSX.Element)[] | IItem<T>[];

export interface IList<T> {
  items: IITems<T>;
  itemClassName?: string;
  className?: string;
  params?: T;
  header?: JSX.Element;
}

export default function List<T extends unknown>({
  className,
  itemClassName,
  items = [],
  params,
  header,
}: IList<T>): JSX.Element {
  return (
    <ul className={cs('flex', className)}>
      {header}
      {items.map((item: JSX.Element | (() => JSX.Element) | IItem<T>) => {
        const isElement = React.isValidElement(item);
        const isFunc = isFunction(item);
        const isObj = isObject(item) && !isElement && !isFunc;
        const curItem = item as IItem<T>;
        if (isObj) {
          return (
            <li
              key={curItem.id}
              onClick={() => {
                curItem.onclick && curItem.onclick(params);
              }}
              className={cs(
                'w-full h-36 px-16 flex items-center',
                'cursor-pointer hover:blue-100 transition',
                itemClassName,
              )}
            >
              {
                curItem.iconName && <Icon name={curItem.iconName} size={16} className="mr-8" />
              }
              <div className="text-14 whitespace-nowrap">{curItem.text}</div>
            </li>
          );
        }
        return (
          <li key={(item as JSX.Element).key} className={cs('transition', itemClassName)}>
            {isFunc && (item as () => JSX.Element)()}
            {isElement && item}
          </li>
        );
      })}
    </ul>
  );
}
