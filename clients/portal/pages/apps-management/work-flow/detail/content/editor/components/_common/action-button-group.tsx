import React, { MouseEventHandler } from 'react';
import cs from 'classnames';

import Button from '@c/button';

interface Props {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function ActionButtonGroup({ onCancel, onSubmit, className }: Props) {
  return (
    <div key="urgeAction" className={cs('flex justify-end pr-16 pb-16 urgeAction', className)}>
      <Button type="button" onClick={onCancel}>取消</Button>
      <Button type="button" onClick={onSubmit}>确定</Button>
    </div>
  );
}
