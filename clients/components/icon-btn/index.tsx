import React from 'react';
import { Icon } from '@QCFE/lego-ui';
import classnames from 'classnames';

interface ButtonProps extends Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'children'
> {
  iconName: string;
  isPrimary?: boolean;
  isLoading?: boolean;
  isForbidden?: boolean;
}

function IconBtn(
  { iconName, className, isPrimary, isLoading, isForbidden, ...restProps }: ButtonProps,
  ref?: React.Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button
      {...restProps}
      ref={ref}
      className={classnames('btn', 'icon-btn', className, {
        'btn--primary': isPrimary,
        'btn--loading': isLoading,
        'btn--forbidden': isForbidden,
      })}
    >
      <Icon name={iconName} type={isPrimary ? 'light' : 'dark'} />
    </button>
  );
}

export default React.forwardRef(IconBtn);
