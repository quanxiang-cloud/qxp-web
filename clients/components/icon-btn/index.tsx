import React from 'react';
import cs from 'classnames';

import Icon, { Props as IconProps } from '@c/icon';

interface Props extends Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'children'
> {
  size?: number;
  iconSize?: number;
  btnType?: 'dark' | 'primary' | 'light';
  iconName: string;
  iconProps?: Omit<Partial<IconProps>, 'ref'>;
  loading?: boolean;
  forbidden?: boolean;
}

function IconBtn(
  {
    size = 32,
    iconSize = 16,
    btnType = 'dark',
    iconName,
    className,
    loading,
    forbidden,
    iconProps = {}, ...restProps }: Props,
  ref?: React.Ref<HTMLButtonElement>,
): JSX.Element {
  const _style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };
  return (
    <button
      {...restProps}
      ref={ref}
      style={_style}
      className={cs('btn', 'icon-btn', `button-bg-${btnType}`, className, {
        'btn--loading': loading,
        'btn--forbidden': forbidden,
        'opacity-50': forbidden,
        'pointer-events-none': loading,
      })}
      disabled={forbidden}
    >
      <Icon
        size={iconSize}
        type={btnType}
        name={loading ? 'loading' : iconName}
        className={cs({ 'animate-spin': loading })}
        {...iconProps}
      />
    </button>
  );
}

export default React.forwardRef(IconBtn);
