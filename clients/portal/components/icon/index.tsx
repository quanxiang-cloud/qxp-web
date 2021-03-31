import React from 'react';
import classnames from 'classnames';

import '@portal/scss/components/_icon.scss';

interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  type?: 'dark' | 'primary' | 'light';
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

function svgIcon(
  {
    name,
    size = 16,
    type = 'dark',
    changeable,
    disabled = false,
    clickable = false,
    className,
    style,
    ...props
  }: Props,
  ref?: React.Ref<SVGSVGElement>
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
      className={classnames('svg-icon', `svg-icon--${type}`, className, {
        'svg-icon--changeable': changeable,
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
      })}
    >
      <use xlinkHref={`/dist/images/sprite.svg#${name}`} />
    </svg>
  );
}

const SvgIconRef = React.forwardRef(svgIcon);

const SvgIcon = SvgIconRef;

export default SvgIcon;
