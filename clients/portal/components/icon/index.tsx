import * as React from 'react';
import classnames from 'classnames';

import { IconName } from './types';

interface Iicon extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  type?: 'dark' | 'coloured' | 'light';
  size?: number;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

export const Icon = (
  {
    name,
    size = 22,
    type = 'dark',
    changeable = false,
    disabled = false,
    clickable = false,
    ...props
  }: Iicon,
  ref: React.Ref<SVGSVGElement>
) => {
  const _style: React.CSSProperties = {
    ...props.style,
    width: size ? `${size - 1}px` : undefined,
    height: size ? `${size - 1}px` : undefined,
  };
  return (
    <svg
      {...props}
      ref={props.ref}
      data-name={name}
      style={_style}
      className={classnames('svg-icon', props.className, {
        [`svg-icon--${type}`]: type,
        'svg-icon--changeable': changeable,
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
      })}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

const SvgIconRef = React.forwardRef(Icon);

const SvgIcon = SvgIconRef;

export default SvgIcon;
