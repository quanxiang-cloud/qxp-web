import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { ItemWithTitleDesc } from './ItemWithTitleDesc';
import { isString } from '@assets/lib/f';

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
    <header className={twCascade('flex justify-between items-center pb-4 opacity-95', className)}>
      <ItemWithTitleDesc
        desc={desc}
        itemRender={
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            {title}
          </div>
        }
        descClassName={twCascade('transition ease-linear text-dot-6 text-697886', descClassName)}
        textDirection={textDirection}
        className={itemClassName}
        titleClassName={titleClassName}
        textClassName={textClassName}
      />
      {isString(action) && (
        <a className={twCascade('transition ease-linear text-dot-7 underline text-324558')}>
          {action}
        </a>
      )}
      {!isString(action) && action && (
        <div className={actionClassName}>{action}</div>
      )}
    </header>
  );
};
