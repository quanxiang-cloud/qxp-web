import React, { HTMLAttributes } from 'react';
import cc from 'classcat';

export type Props = HTMLAttributes<HTMLDivElement>

export default function ControlButton({ children, className, onClick }: Props) {
  return (
    <div className={cc(['react-flow__controls-button', className])} onClick={onClick}>
      {children}
    </div>
  );
}
