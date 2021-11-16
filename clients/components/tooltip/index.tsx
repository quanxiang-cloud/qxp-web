import React, { useState, CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react';
import { omit } from 'lodash';
import cs from 'classnames';

import Tip from './tip';

export type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  position: 'left' | 'right' | 'top' | 'bottom';
  label: JSX.Element | string;
  children?: JSX.Element;
  labelClassName?: string;
  arrowStyle?: CSSProperties;
  inline?: boolean;
  wrapperClassName?: string;
  relative?: boolean;
  always?: boolean;
}

export default function ToolTip(props: Props) {
  const {
    className, children, inline, wrapperClassName, labelClassName, always, relative = true, ...otp
  } = props;
  const [show, setShow] = useState(!!always);

  function onMouseEnter() {
    !always && setShow(true);
  }

  function onMouseLeave() {
    !always && setShow(false);
  }

  return (
    <div
      className={cs(relative ? 'relative' : '', {
        'flex-1': !inline,
      }, wrapperClassName)}
      {...otp}
    >
      <Tip
        className={`absolute ${className}`}
        labelClassName={labelClassName}
        show={show}
        {...omit(props, ['className', 'children'])}
      />
      <div
        className="flex items-center"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}
