import React, { MouseEvent } from 'react';

import { twCascade } from '@mariusmarais/tailwind-cascade';

export interface IItemWithTitleDesc {
  title?: string;
  desc?: string;
  itemRender: JSX.Element;
  titleClassName?: string;
  descClassName?: string;
  textDirection?: 'row' | 'col';
  className?: string;
  textClassName?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function ItemWithTitleDesc({
  title,
  desc,
  itemRender,
  textClassName,
  titleClassName,
  descClassName,
  textDirection,
  className,
  onClick,
}: IItemWithTitleDesc) {
  return (
    <div
      className={
        twCascade('flex justify-start', className)
      }
      onClick={onClick}
    >
      {itemRender}
      <div
        className={twCascade(
          'justify-between flex flex-1',
          {
            'flex-row': textDirection == 'row',
            'flex-col': textDirection != 'row',
            'ml-8': !textClassName?.startsWith('ml'),
          },
          textClassName,
        )}
      >
        {title && <div className={twCascade(titleClassName)}>{title}</div>}
        {desc && (
          <span className={twCascade('flex items-center leading-24', descClassName)}>{desc}</span>
        )}
      </div>
    </div>
  );
}
