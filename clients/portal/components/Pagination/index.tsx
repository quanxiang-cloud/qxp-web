import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Core } from './Core';
import { SizeSelect } from './SizeSelect';

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

  return (
    <div
      className={twCascade(
          'inline-flex items-center justify-between bg-white px-1-dot-2',
          'py-dot-4 w-full border-t border-blue-third',
          className,
      )}
    >
      {type === 'simple' && <div>{prefix}</div>}
      <Core current={current} maxPage={maxPage} onChange={onChange} />
      {type === 'simple' && (
        <SizeSelect
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onShowSizeChange={onShowSizeChange}
        />
      )}
    </div>
  );
};
