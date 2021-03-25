import React, { useEffect } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Core } from './pagger';
import Select from '@c/select';

interface PaginationProps {
  type?: 'simple' | 'mini';
  current: number;
  total: number;
  pageSize: number;
  pageSizeOptions?: number[];
  className?: string;
  style?: Record<string, string>;
  onChange?: (current: number) => void;
  onShowSizeChange?: (pageSize: number) => void;
  prefix?: JSX.Element | string;
}

export const Pagination = ({
  type = 'mini',
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions,
  onShowSizeChange,
  prefix = '',
  className,
}: PaginationProps) => {
  const maxPage = Math.ceil(total / pageSize);

  useEffect(() => {
    const maxPage = Math.ceil(total / pageSize);
    if (current > maxPage && !!maxPage && onChange) {
      onChange(1);
    }
  }, [current, total, pageSize]);


  const selectChange = (val: number) => {
    onShowSizeChange && onShowSizeChange(val);
  };

  return (
    <div
      className={twCascade(
        'inline-flex items-center justify-between bg-white px-1-dot-2',
        'py-8 w-full border-t border-gray-200',
        className,
      )}
    >
      {type === 'simple' ? <div>{prefix}</div> : <div></div>}
      <div className="flex items-center">
        <Core current={current <= maxPage ? current : 1} maxPage={maxPage} onChange={onChange} />
        <div className="w-2-dot-7"></div>
        {type === 'simple' && (<div className="flex itmes-center">
          <div className="text-1-dot-2 mr-dot-6 text-center leading-2-dot-8">每页</div>
          <Select
            value={pageSize}
            onChange={selectChange}
            className="h-2-dot-8 border border-gray-300 rounded-r-8
            rounded-tl-2 rounded-bl-8 px-1-dot-2 text-1-dot-2 flex items-center"
            options={[{
              value: 10,
              label: '10 条',
            },
            {
              value: 20,
              label: '20 条',
            },
            {
              value: 50,
              label: '50 条',
            },
            {
              value: 100,
              label: '100 条',
            }]}
          />
        </div>
        )}
      </div>
    </div>
  );
};
