import React, { useEffect } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Core } from './pagger';
import { SizeSelect } from './size-select';

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

  return (
    <div
      className={twCascade(
        'inline-flex items-center justify-between bg-white px-1-dot-2',
        'py-dot-4 w-full border-t border-blue-third',
        className,
      )}
    >
      {type === 'simple' ? <div>{prefix}</div> : <div></div>}
      <div className="flex items-center">
        <Core current={current <= maxPage ? current : 1} maxPage={maxPage} onChange={onChange} />
        <div className="w-2-dot-7"></div>
        {type === 'simple' && (<>
          <SizeSelect
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onShowSizeChange={onShowSizeChange}
          />
        </>
        )}
      </div>
    </div>
  );
};
