import React from 'react';
import cs from 'classnames';
import { useCss } from 'react-use';

import svgHash from './svg-hash';

export interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?: string;
  size?: number;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

function Icon(
  {
    name,
    size = 16,
    color,
    changeable,
    disabled,
    clickable,
    className,
    style,
    ...props
  }: Props,
  ref?: React.Ref<SVGSVGElement>,
): JSX.Element {
  let iconColor;
  const _style: React.CSSProperties = {
    ...style,
    width: `${size - 1}px`,
    height: `${size - 1}px`,
  };

  if (color) {
    iconColor = useCss({
      color: `var(--${color}-600)`,
      fill: `var(--${color}-400)`,
    });
  }

  return (
    <svg
      {...props}
      ref={ref}
      data-name={name}
      style={_style}
      className={cs('svg-icon', className, iconColor, {
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
