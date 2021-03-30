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

export default function Pagination({
  type = 'mini',
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = [10, 20, 50, 100],
  onShowSizeChange,
  prefix = '',
  className,
}: PaginationProps) {
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
        'inline-flex items-center justify-between bg-white px-24',
        'py-8 w-full border-gray-200',
        className,
      )}
    >
      {type === 'simple' ? <div>{prefix}</div> : <div></div>}
      <div className="flex items-center">
        <Core current={current <= maxPage ? current : 1} maxPage={maxPage} onChange={onChange} />
        <div className="w-16"></div>
        {type === 'simple' && (<div className="flex itmes-center">
          <div className="text-12 mr-6 text-center leading-28">每页</div>
          <Select
            value={pageSize}
            onChange={selectChange}
            className="h-28 border border-gray-300 select-border-radius
            px-12 text-12 flex items-center"
            options={pageSizeOptions.map((page: number) => ({
              label: `${page} 条`,
              value: page,
            }))}
          />
        </div>
        )}
      </div>
    </div>
  );
}
