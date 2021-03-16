import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { identity } from '@assets/lib/f';

interface ICore {
  current: number;
  maxPage: number;
  onChange?: (current: number) => void;
}

export const Core = ({ current, onChange = identity, maxPage }: ICore) => {
  const onPrev = () => {
    if (current <= 1) {
      return;
    }
    onChange(current - 1);
  };

  const onNext = () => {
    if (current >= maxPage) {
      return;
    }
    onChange(current + 1);
  };

  return (
    <div className="flex items-center mr-1">
      <div
        onClick={onPrev}
        className={twCascade(
          'w-1-dot-4 h-1-dot-4 text-center text-94A3B8 leading-1-dot-4',
          'flex justify-center items-center',
          current <= 1 ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        &lt;
      </div>
      <div
        className={twCascade(
          'h-1-dot-4 px-2 bg-F0F6FF text-375FF3 rounded-l-dot-4 rounded-br-dot-4',
          'rounded-tr-dot-1 font-normal flex justify-center items-center',
        )}
      >
        {current}
      </div>
      <div
        onClick={onNext}
        className={twCascade(
          'w-1-dot-4 h-1-dot-4 text-center text-94A3B8 leading-1-dot-4',
          'flex justify-center items-center',
          current >= maxPage ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        &gt;
      </div>
    </div>
  );
};
