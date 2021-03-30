import * as React from 'react';
import classnames from 'classnames';

import './_icon.scss';

interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  type?: 'dark' | 'coloured' | 'light';
  size?: number;
  style?: {};
  color?: string;
  className?: any;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

function SvgIcon({
  name,
  size = 24,
  type = 'dark',
  changeable = false,
  disabled = false,
  clickable = false,
  className,
  color,
  style,
  ...props
}: Props) {
  const _style: React.CSSProperties = {
    ...style,
    width: size ? `${size - 1}px` : undefined,
    height: size ? `${size - 1}px` : undefined,
  };

  return (
    <svg
      {...props}
      ref={props.ref}
      data-name={name}
      style={_style}
      className={classnames('svg-icon', `svg-icon--${type}`, className, {
        'svg-icon--changeable': changeable,
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
      })}
    >
      <use xlinkHref={`../dist/images/sprite.svg#${name}`} />
    </svg>
  );
}

export default SvgIcon;
