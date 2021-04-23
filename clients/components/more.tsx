import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Icon } from '@QCFE/lego-ui';

import Popover from './popover';
import List, { IITems } from './list';

export interface IMore<T> {
  items: IITems<T>;
  header?: JSX.Element;
  className?: string;
  triggerClassName?: string;
  tooltipClassName?: string;
  params?: T;
  offsetX?: number;
  offsetY?: number;
  children?: React.ReactNode;
  contentClassName?: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  contentItemClassName?: string;
  placement?: 'bottom-end' | 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end'
    | 'bottom-start' | 'right-start' | 'right-end' | 'left-start' | 'left-end' | 'auto'
    | 'auto-start' | 'auto-end' | undefined;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function More<T>({
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
  header,
  onOpen,
  onClose,
}: IMore<T>) {
  return (
    <Popover
      className={className}
      triggerClassName={triggerClassName}
      tooltipClassName={tooltipClassName}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onOpen={onOpen}
      onClose={onClose}
      content={(
        <List<T>
          header={header}
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
}
