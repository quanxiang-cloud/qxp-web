import React from 'react';
import cs from 'classnames';

import svgHash from './svg-hash';

interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  type?: 'dark' | 'primary' | 'light';
  size?: number;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

function Icon(
  {
    name,
    size = 16,
    type = 'dark',
    changeable,
    disabled,
    clickable,
    className,
    style,
    ...props
  }: Props,
  ref?: React.Ref<SVGSVGElement>,
) {
  const _style: React.CSSProperties = {
    ...style,
    width: `${size - 1}px`,
    height: `${size - 1}px`,
  };

  return (
    <svg
      {...props}
      ref={ref}
      data-name={name}
      style={_style}
      className={cs('svg-icon', `svg-icon--${type}`, className, {
        'svg-icon--changeable': changeable,
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
      })}
    >
      <use xlinkHref={`${svgHash}#${name}`} />
    </svg>
  );
}

export default React.forwardRef(Icon);
