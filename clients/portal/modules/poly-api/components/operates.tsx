import React from 'react';
import cs from 'classnames';

import Tooltip from '@c/tooltip';

type Props = {
  operates: Record<string, string>
  onClick: (operate: string) => void;
  className?: string;
}

function Operates({ operates, onClick, className }: Props): JSX.Element {
  return (
    <div
      className={cs('flex items-start p-12 cursor-pointer border-b-1', className)}
    >
      <span className="text-12 font-semibold mr-8 whitespace-nowrap">运算符：</span>
      <div className="flex items-center justify-between gap-8 flex-wrap">
        {Object.entries(operates).map(([operate, label]) => {
          return (
            <Tooltip className="z-10 text-12" key={operate} position="bottom" label={label}>
              <span
                className="request-op"
                onClick={() => onClick(operate)}
              >
                {operate}
              </span>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default Operates;
