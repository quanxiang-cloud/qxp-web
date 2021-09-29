import React from 'react';
import { useCss } from 'react-use';
import cs from 'classnames';

import DragDrop from '@c/form-builder/components/drag-drop';

import './index.scss';

export function EmptyLayout({
  pid,
  ...rest
}: {
  pid: string;
  cols?: number;
} | Record<string, any>): JSX.Element {
  const { cols = 1 } = rest;

  const emptyWith = useCss({
    width: `${cols * 100}%`,
  });

  const cls = cs('empty-field', emptyWith);

  return (
    <DragDrop
      id={pid}
      pid={pid}
      {...rest}
    >
      <div className={cls} />
    </DragDrop>
  );
}
