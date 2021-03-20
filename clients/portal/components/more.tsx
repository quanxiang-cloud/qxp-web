import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Popover } from './popover';
import { Dot } from './dot';
import { List, IITems } from './list';

export interface IMore<T> {
  className?: string;
  triggerClassName?: string;
  tooltipClassName?: string;
  items: IITems<T>;
  params?: T;
  offsetX?: number;
  offsetY?: number;
  children?: React.ReactNode;
  contentClassName?: string;
}

export const More = function <T>({
  className,
  items,
  params,
  triggerClassName,
  tooltipClassName,
  contentClassName,
  offsetX,
  offsetY,
  children,
}: IMore<T>) {
  return (
    <Popover
      className={className}
      triggerClassName={triggerClassName}
      tooltipClassName={tooltipClassName}
      content={(
        <List<T>
          items={items}
          params={params}
          itemClassName="hover:bg-blue-light"
          className={
            twCascade(
              'min-w-24 z-10 py-dot-8 shadow-title bg-white',
              'rounded-dot-6 absolute top-1-dot-6 right-0 mt-dot-6 mr-4',
              contentClassName,
            )
          }
        />
      )}
      offsetX={offsetX}
      offsetY={offsetY}
      placement="bottom-end"
    >
      {children ? (
        <>{children}</>
      ): (
        <div className="flex flex-row items-center cursor-pointer justify-start mr-dot875">
          <Dot />
          <Dot />
          <Dot />
        </div>
      )}
    </Popover>
  );
};
