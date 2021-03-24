import * as React from 'react';
import classnames from 'classnames';

import './_icon.scss';
import { IconName } from './types';

interface Icon extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  type?: 'dark' | 'coloured' | 'light';
  size?: number;
  color?: string;
  className?: any;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

interface Style {
  width?: string;
  height?: string;
  color?: string;
}

const Icon = (
  {
    name,
    size = 22,
    type = 'dark',
    changeable = false,
    disabled = false,
    clickable = false,
    className,
    color,
    ...props
  }: Icon,
  ref: React.Ref<SVGSVGElement>
) => {
  const styleCSS: Style = {
    width: size ? `${size - 1}px` : undefined,
    height: size ? `${size - 1}px` : undefined,
  };

  if (color) {
    styleCSS.color = color;
  }

  const _style: React.CSSProperties = styleCSS;

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
};

const SvgIconRef = React.forwardRef(Icon);

const SvgIcon = SvgIconRef;

export default SvgIcon;
