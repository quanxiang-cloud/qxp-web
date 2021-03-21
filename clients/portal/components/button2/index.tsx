import React from 'react';
import { Icon } from '@QCFE/lego-ui';
import classnames from 'classnames';

interface ButtonProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement>
{
  icon?: string;
  className?: string;
  isPrimary?: boolean;
  isLoading?: boolean;
  isForbidden?: boolean;
}

export default function Button(
  { children, icon, className, isPrimary, isLoading, isForbidden, ...restProps }: ButtonProps
): JSX.Element {
  return (
    <button
      { ...restProps }
      className={classnames('btn', className, {
        'btn--primary': isPrimary,
        'btn--loading': isLoading,
        'btn--forbidden': isForbidden,
      })}
    >
      {
        icon && (
          <Icon name={icon} type={isPrimary ? 'light' : 'dark'} />
        )
      }
      {children}
    </button>
  );
}
