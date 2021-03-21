import React, { useEffect } from 'react';
import { Select } from '@QCFE/lego-ui';

interface ISizeSelect {
  pageSize: number;
  onShowSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const SizeSelect = ({
  pageSize,
  onShowSizeChange,
  pageSizeOptions = [10, 20, 50, 100].includes(pageSize) ?
    [10, 20, 50, 100] : [pageSize, 10, 20, 50, 100],
}: ISizeSelect) => {
  useEffect(() => {
    onShowSizeChange && onShowSizeChange(pageSizeOptions[0]);
  }, []);

  return (
    <div className="flex items-center">
      <span className="text-1-dot-2 mr-dot-3 text-dark-second">每页</span>
      <div className="w-16">
        <Select
          className="qxp-single-select"
          value={pageSize}
          onChange={onShowSizeChange}
          options={pageSizeOptions.map((item) => ({
            value: item,
            label: `${item}条`,
          }))}
        />
      </div>
    </div>
  );
};
