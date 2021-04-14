import React, { forwardRef, Ref } from 'react';
import classnames from 'classnames';

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
      className={classnames('btn', className, {
        [`btn--${modifier}`]: modifier,
        'btn--forbidden': forbidden,
        'btn--loading': loading,
        'opacity-50': forbidden,
        'pointer-events-none': loading,
      })}
      disabled={forbidden}
    >
      {iconName && (
        <Icon
          name={loading ? 'loading' : iconName}
          type={modifier === 'primary' ? 'light' : 'dark'}
          size={20}
          className={classnames('fill-current text-inherit mr-8', {
            'animate-spin': loading,
          })}
        />
      )}
      {children}
    </button>
  );
}

export default forwardRef(Button);
