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
}

function Button(
  { children, iconName, className, modifier, forbidden, loading, ...rest }: Props,
  ref?: Ref<HTMLButtonElement>
) {
  return (
    <button
      {...rest}
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
      {iconName && (
        <Icon
          name={loading ? 'loading' : iconName}
          type={modifier === 'primary' ? 'light' : 'dark'}
          size={20}
          className={cs('fill-current text-inherit mr-8', {
            'animate-spin': loading,
            'pointer-events-none': loading || forbidden,
          })}
        />
      )}
      {children}
    </button>
  );
}

export default forwardRef(Button);
