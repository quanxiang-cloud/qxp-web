import React, { ForwardedRef, forwardRef, PropsWithChildren } from 'react';
import cs from 'classnames';

import './index.scss';

type Props = PropsWithChildren<{
  className?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  beganClose: boolean;
  contentShow: boolean;
}>

function Mask({
  className,
  position = 'bottom',
  beganClose,
  contentShow,
  children,
}: Props, ref: ForwardedRef<HTMLDivElement | null>): JSX.Element | null {
  return (
    <div
      ref={ref}
      className={cs(`drawer-modal-mask drawer-position-${position}`, {
        'drawer-began-close': beganClose,
        'drawer-close': !contentShow,
      }, className)}
    >
      {children}
    </div>
  );
}

export default forwardRef<HTMLDivElement, Props>(Mask);
