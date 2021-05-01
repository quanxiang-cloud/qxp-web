import React, { useState, CSSProperties } from 'react';
import { omit } from 'lodash';
import cs from 'classnames';

import Tip from './tip';

export interface Props {
  className?: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  label: JSX.Element | string;
  children?: JSX.Element;
  labelClassName?: string;
  style?: CSSProperties;
  arrowStyle?: CSSProperties;
  inline?: boolean;
  wrapperClassName?: string;
  relative?: boolean;
}

export default function ToolTip(props: Props) {
  const [show, setShow] = useState(false);
  const { className, children, inline, wrapperClassName, relative = true } = props;

  function onMouseEnter() {
    setShow(true);
  }

  function onMouseLeave() {
    setShow(false);
  }

  return (
    <div className={cs(relative ? 'relative' : '', {
      'flex-1': !inline,
    }, wrapperClassName)}>
      <Tip
        className={`absolute ${className}`}
        show={show}
        {...omit(props, ['className', 'children'])}
      />
      <div
        className="flex items-center justify-around"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}
