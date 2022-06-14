import React, { CSSProperties, ForwardedRef, forwardRef, PropsWithChildren } from 'react';

interface Props {
  className: string;
  style: CSSProperties;
  columnGap?: string;
  rowGap?: string;
  alignContent: 'baseline' |'stretch' | 'start' | 'center' | 'end' | 'space-around' | 'space-evenly' | 'space-between';
  justifyContent: 'baseline' | 'stretch' | 'start' | 'center' | 'end' | 'space-around' | 'space-evenly' | 'space-between';
  justifyItems: 'stretch' | 'start' | 'center' | 'end';
  alignItems: 'stretch' | 'start' | 'center' | 'end';
  coloumCount?: number;
  rowCount?: number;
}

function GridContainer(
  {
    className,
    style,
    columnGap = '16px',
    rowGap = '16px',
    justifyItems = 'stretch',
    alignItems = 'stretch',
    alignContent = 'stretch',
    justifyContent = 'stretch',
    coloumCount,
    rowCount,
    children,
  }: PropsWithChildren<Props>,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const _styles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${coloumCount}, auto)`,
    gridTemplateRows: `repeat(${rowCount}, auto)`,
  };

  return (
    <div
      className={className}
      style={{
        ..._styles,
        columnGap,
        rowGap,
        justifyItems,
        alignItems,
        alignContent,
        justifyContent,
        ...style,
      }}
      ref={ref}
    >
      {children}
    </div>
  );
}

export default forwardRef<HTMLDivElement, PropsWithChildren<Props>>(GridContainer);
