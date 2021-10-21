import React, { forwardRef, Ref } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

interface Props extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  modifier?: 'primary' | 'danger';
  loading?: boolean;
  forbidden?: boolean;
  iconName?: string;
  iconSize?: number;
  textClassName?: string;
}

function Button(
  {
    children,
    iconName,
    className,
    modifier,
    forbidden,
    loading,
    iconSize = 20,
    textClassName,
    type = 'button',
    ...rest
  }: Props,
  ref?: Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button
      {...rest}
      type={type}
      ref={ref}
      className={cs('btn', className, {
        [`btn--${modifier}`]: modifier,
        'btn--forbidden': forbidden,
        'btn--loading': loading,
        'opacity-50': forbidden,
        'pointer-events-none': loading || forbidden,
      })}
      disabled={forbidden}
    >
      {(iconName || loading) && (
        <Icon
          name={loading ? 'refresh' : iconName || 'refresh'}
          type={modifier === 'primary' ? 'light' : 'dark'}
          size={iconSize}
          className={cs('fill-current text-inherit mr-8', {
            'animate-spin': loading,
            'pointer-events-none': loading || forbidden,
          })}
        />
      )}
      <div className={textClassName}>{!loading && children}</div>
    </button>
  );
}

export default forwardRef(Button);
