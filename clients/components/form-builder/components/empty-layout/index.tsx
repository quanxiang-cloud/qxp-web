import React from 'react';
import { useCss } from 'react-use';
import cs from 'classnames';

import DragDrop from '@c/form-builder/components/drag-drop';

import './index.scss';

export function EmptyLayout({
  pId,
  ...rest
}: {
  pId: string;
  cols?: number;
} | Record<string, any>): JSX.Element {
  const { cols = 1 } = rest;

  const emptyWith = useCss({
    width: `${cols * 100}%`,
  });

  const cls = cs('empty-field', emptyWith);

  return (
    <DragDrop
      id={pId}
      pId={pId}
      {...rest}
    >
      <div className={cls} />
    </DragDrop>
  );
}
