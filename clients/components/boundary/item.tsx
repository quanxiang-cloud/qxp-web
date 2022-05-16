import React from 'react';

import HandleLine from './handleLine';

export type Props = {
  style?: React.CSSProperties;
  size: number;
  hiddenHandle?: boolean;
  changeSize?: (size: number, cb: () => void) => void;
  changed?: (size: number) => void;
  children: React.ReactNode;
};

export default function BoundaryItem({
  style,
  size,
  hiddenHandle,
  changeSize,
  changed,
  children,
}: Props): JSX.Element {
  return (
    <div
      className='boundary-item-box'
      style={{ ...style, width: `${size}%` }}
    >
      {!hiddenHandle && (
        <HandleLine
          position='right'
          changeSize={changeSize}
          changed={changed}
        />
      )}
      <div className='boundary-item-content' >
        {children}
      </div>
    </div>
  );
}
