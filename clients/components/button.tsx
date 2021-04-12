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
        'btn--loading': loading,
        'cursor-not-allowed': forbidden,
        'opacity-50': forbidden,
        'pointer-events-none': loading || forbidden,
      })}
    >
      {iconName && (
        <Icon
          name={iconName}
          type={modifier === 'primary' ? 'light' : 'dark'}
          disabled={forbidden}
          size={20}
          className="fill-current text-inherit mr-8"
        />
      )}
      {children}
    </button>
  );
}

export default forwardRef(Button);
