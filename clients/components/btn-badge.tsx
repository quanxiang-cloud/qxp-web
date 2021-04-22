import React from 'react';
import classNames from 'classnames';

interface Props {
  count?: number;
  className?: string;
}

const BtnBadge = ({ count=0, className }: Props) => {
  return (
    <button className={classNames('absolute btn btn--danger btn-badge h-4', className)}>
      {count > 99 ? '99+' : count}
    </button>
  );
};

export default BtnBadge;
