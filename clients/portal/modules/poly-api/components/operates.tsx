import React from 'react';

import Tooltip from '@c/tooltip';

type Props = {
  operates: Record<string, string>
  onClick: (operate: string) => void;
}

function Operates({ operates, onClick }: Props): JSX.Element {
  return (
    <div className="flex items-center py-12 cursor-pointer border-b-1 mx-12">
      <span className="text-12 font-semibold">运算符：</span>
      <div className="flex-1 flex items-center justify-between gap-8">
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
