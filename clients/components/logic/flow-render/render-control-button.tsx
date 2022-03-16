import React, { HTMLAttributes } from 'react';
import cc from 'classcat';

export type Props = HTMLAttributes<HTMLDivElement>

export default function ControlButton({ children, className, ...props }: Props): JSX.Element {
  return (
    <div {...props} className={cc(['react-flow__controls-button', className])}>
      {children}
    </div>
  );
}
