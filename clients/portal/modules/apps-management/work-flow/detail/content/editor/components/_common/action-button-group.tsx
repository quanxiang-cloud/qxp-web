import React, { MouseEventHandler } from 'react';
import cs from 'classnames';

import Button from '@c/button';

interface Props {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  okText?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ActionButtonGroup({
  onCancel, onSubmit, className, okText = '确定', onClick,
}: Props) {
  return (
    <div
      key="urgeAction"
      onClick={(e) => {
        onClick && onClick(e);
        e.stopPropagation();
      }}
      className={cs(
        'flex justify-end pr-16 pb-16 urgeAction',
        className)
      }>
      <Button type="button" onClick={onCancel}>取消</Button>
      <Button type="button" onClick={onSubmit}>{okText}</Button>
    </div>
  );
}
