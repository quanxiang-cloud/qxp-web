import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Popover } from './popover2';
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
  onMouseOver?: () => void;
  onMouseOut?: () => void;
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
  onMouseOver,
  onMouseOut,
}: IMore<T>) {
  return (
    <Popover
      className={className}
      triggerClassName={triggerClassName}
      tooltipClassName={tooltipClassName}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      content={(
        <List<T>
          items={items}
          params={params}
          itemClassName="hover:bg-blue-light"
          className={
            twCascade(
              'min-w-24 z-10 py-dot-8 shadow-title bg-white',
              'rounded-dot-6 absolute top-1-dot-6 right-0 mt-dot-6 mr-8',
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
        <div className="flex-start-center mr-dot875">
          <Dot />
          <Dot />
          <Dot />
        </div>
      )}
    </Popover>
  );
};
