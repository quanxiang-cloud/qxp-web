import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { ItemWithTitleDesc } from './item-with-title-desc4';
import { isString } from '@assets/lib/utils';

export interface ITextHeader {
  className?: string;
  title: JSX.Element | string;
  desc?: string;
  action?: JSX.Element | string;
  actionClassName?: string;
  textDirection?: 'row' | 'col';
  itemClassName?: string;
  titleClassName?: string;
  descClassName?: string;
  textClassName?: string;
}

export const TextHeader = ({
  className,
  actionClassName,
  title,
  desc,
  action,
  textDirection,
  itemClassName,
  titleClassName,
  descClassName,
  textClassName,
}: ITextHeader) => {
  return (
    <header className={twCascade('flex justify-between items-center pb-20 opacity-95', className)}>
      <ItemWithTitleDesc
        desc={desc}
        itemRender={
          <div className="font-bold text-16 text-gray-900 flex justify-between items-center">
            {title}
          </div>
        }
        descClassName={twCascade(
          'transition ease-linear text-1-dot-2 text-blueGray-400',
          descClassName
        )}
        textDirection={textDirection}
        className={itemClassName}
        titleClassName={titleClassName}
        textClassName={textClassName}
      />
      {isString(action) && (
        <a className={twCascade('transition ease-linear text-1-dot-4 underline text-gray-600')}>
          {action}
        </a>
      )}
      {!isString(action) && action && (
        <div className={actionClassName}>{action}</div>
      )}
    </header>
  );
};
