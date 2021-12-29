import * as React from 'react';
import classNames from 'classnames';
import RowContext from './RowContext';

enum RowAligns {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
  stretch = 'stretch',
}

enum RowJustify {
  start = 'start',
  end = 'end',
  center = 'center',
  spaceAround = 'space-around',
  spaceBetween = 'space-between'
}

export type Gutter = number;
export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gutter?: Gutter | [Gutter, Gutter];
  align?: RowAligns;
  justify?: RowJustify;
  wrap?: boolean;
}

const Row = React.forwardRef<HTMLDivElement, RowProps>((props: RowProps, ref) => {
  const {
    justify,
    align,
    className,
    style,
    children,
    gutter = 0,
    wrap,
    ...otherProps
  } = props;

  const prefixCls = 'qxb-web-row';

  const getGutter = (): [number, number] => {
    return Array.isArray(gutter) ? gutter : [gutter, 0];
  };

  const gutters = getGutter();
  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-no-wrap`]: wrap === false,
      [`${prefixCls}-${justify}`]: justify,
      [`${prefixCls}-${align}`]: align,
    },
    className,
  );

  const rowStyle: React.CSSProperties = {};
  const horizontalGutter = gutters[0] > 0 ? gutters[0] / -2 : undefined;
  const verticalGutter = gutters[1] > 0 ? gutters[1] / -2 : undefined;

  if (horizontalGutter) {
    rowStyle.marginLeft = horizontalGutter;
    rowStyle.marginRight = horizontalGutter;
  }

  if (verticalGutter) {
    rowStyle.marginTop = verticalGutter;
    rowStyle.marginBottom = verticalGutter;
  }

  const rowContext = React.useMemo(() => ({ gutter: gutters, wrap }), [
    gutters,
    wrap,
  ]);

  return (
    <RowContext.Provider value={rowContext}>
      <div {...otherProps} className={classes} style={{ ...rowStyle, ...style }} ref={ref}>
        {children}
      </div>
    </RowContext.Provider>
  );
});

Row.displayName = 'Row';

export default Row;
