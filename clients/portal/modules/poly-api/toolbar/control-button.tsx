import React, { HTMLAttributes } from 'react';
import cs from 'classnames';

export type Props = HTMLAttributes<HTMLDivElement>

export default function ControlButton({ children, className, onClick }: Props): JSX.Element {
  return (
    <div className={cs('react-flow__controls-button', className)} onClick={onClick}>
      {children}
    </div>
  );
}
