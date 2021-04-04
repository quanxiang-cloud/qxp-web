import React from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

interface ButtonProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement> {
  icon?: string;
  isPrimary?: boolean;
  isLoading?: boolean;
  isForbidden?: boolean;
}

function Button(
  { children, icon, className, isPrimary, isLoading, isForbidden, ...restProps }: ButtonProps,
  ref?: React.Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button
      {...restProps}
      ref={ref}
      className={classnames('btn', className, {
        'btn--primary': isPrimary,
        'btn--loading': isLoading,
        'btn--forbidden': isForbidden,
      })}
    >
      {
        icon && (
          <Icon size={20} className='mr-8' name={icon} type={isPrimary ? 'light' : 'dark'} />
        )
      }
      {children}
    </button>
  );
}

export default React.forwardRef(Button);
