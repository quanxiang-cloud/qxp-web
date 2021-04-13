import React from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

interface ButtonProps extends Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'children'
> {
  iconName: string;
  loading?: boolean;
  forbidden?: boolean;
}

function IconBtn(
  { iconName, className, loading, forbidden, ...restProps }: ButtonProps,
  ref?: React.Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button
      {...restProps}
      ref={ref}
      className={classnames('btn', 'icon-btn', className, {
        'btn--loading': loading,
        'btn--forbidden': forbidden,
        'opacity-50': forbidden,
        'pointer-events-none': loading,
      })}
      disabled={forbidden}
    >
      <Icon
        name={loading ? 'loading' : iconName}
        className={classnames({ 'animate-spin': loading })}
      />
    </button>
  );
}

export default React.forwardRef(IconBtn);
