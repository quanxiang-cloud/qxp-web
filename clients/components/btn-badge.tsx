import React from 'react';
import cs from 'classnames';

interface Props {
  count?: number;
  className?: string;
}

export default function BtnBadge({ count = 0, className }: Props) {
  return (
    <button className={cs('absolute inline-flex items-center btn-badge bg-red-500', className)}>
      {count > 99 ? '99+' : count}
    </button>
  );
}
