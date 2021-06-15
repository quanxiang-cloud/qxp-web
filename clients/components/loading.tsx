import React from 'react';
import { Loading as LegoLoading } from '@QCFE/lego-ui';
import cs from 'classnames';

export interface ILoading {
  desc?: string | JSX.Element;
  className?: string;
}

export default function Loading({ desc = 'Loading...', className }: ILoading) {
  return (
    <div
      className={cs(
        'w-full h-full flex flex-col items-center justify-center py-4',
        className,
      )}
    >
      <LegoLoading />
      <span>{desc}</span>
    </div>
  );
}
