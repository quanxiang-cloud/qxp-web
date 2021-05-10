import React, { MouseEventHandler } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Button from '@c/button';

interface Props {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  okText?: string;
}

export default function ActionButtonGroup({
  onCancel, onSubmit, className, okText = '确定',
}: Props) {
  return (
    <div
      key="urgeAction"
      className={twCascade(
        'flex justify-end pr-16 pb-16 urgeAction',
        className)
      }>
      <Button type="button" onClick={onCancel}>取消</Button>
      <Button type="button" onClick={onSubmit}>{okText}</Button>
    </div>
  );
}
