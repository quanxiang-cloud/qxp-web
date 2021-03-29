import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { isString } from '@assets/lib/utils';

import { ItemWithTitleDesc } from './item-with-title-desc';

export interface Props {
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
  itemTitleClassName?: string;
}

export default function TextHeader({
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
  itemTitleClassName,
}: Props) {
  return (
    <header className={twCascade('flex justify-between items-center pb-20 opacity-95', className)}>
      <ItemWithTitleDesc
        desc={desc}
        itemRender={
          <div
            className={
              twCascade('text-gray-900 flex justify-between items-center', itemTitleClassName)
            }>
            {title}
          </div>
        }
        descClassName={twCascade(
          'transition ease-linear text-12 text-blueGray-400',
          descClassName
        )}
        textDirection={textDirection}
        className={itemClassName}
        titleClassName={titleClassName}
        textClassName={textClassName}
      />
      {isString(action) && (
        <a className={twCascade('transition ease-linear text-14 underline text-gray-600')}>
          {action}
        </a>
      )}
      {!isString(action) && action && (
        <div className={actionClassName}>{action}</div>
      )}
    </header>
  );
}
