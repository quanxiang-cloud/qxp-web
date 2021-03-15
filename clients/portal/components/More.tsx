import React from 'react';

import { ActionsList, IActionListItem } from './ActionsList';
import { Popover } from './Popover';
import { Dot } from './Dot';

export interface IMore<T> {
  className?: string;
  triggerClassName?: string;
  tooltipClassName?: string;
  actions: IActionListItem<T>[];
  params: T;
}

export const More = function <T>({
  className,
  actions,
  params,
  triggerClassName,
  tooltipClassName,
}: IMore<T>) {
  return (
    <Popover
      className={className}
      triggerClassName={triggerClassName}
      tooltipClassName={tooltipClassName}
      content={<ActionsList<T> actions={actions} params={params} className="right-6" />}
    >
      <div className="flex flex-row items-center cursor-pointer">
        <Dot />
        <Dot />
        <Dot />
      </div>
    </Popover>
  );
};
