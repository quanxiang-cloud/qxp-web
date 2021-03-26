import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Icon } from '@QCFE/lego-ui';

import { Popover } from './popover2';
import { List, IITems } from './list2';

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
  contentItemClassName?: string;
}

export const More = function <T>({
  className,
  items,
  params,
  triggerClassName,
  tooltipClassName,
  contentClassName,
  contentItemClassName,
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
          itemClassName={twCascade('hover:bg-blue-100', contentItemClassName)}
          className={
            twCascade(
              'min-w-90 z-10 py-16 shadow-title bg-white',
              'rounded-6 absolute right-0 top-full mr-2 mt-12',
              contentClassName,
            )
          }
        />
      )}
      offsetX={offsetX}
      offsetY={offsetY}
      placement="bottom-end"
    >
      {children ? children : (
        <Icon
          changeable
          clickable
          name="more"
          style={{ transform: 'rotate(90deg)' }}
          className={className}
        />
      )}
    </Popover>
  );
};
