import React from 'react';
import cs from 'classnames';

import Icon, { Props as IconProps } from '@c/icon';

interface Props extends Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'children'
> {
  iconName: string;
  iconProps?: Omit<Partial<IconProps>, 'ref'>;
  loading?: boolean;
  forbidden?: boolean;
}

function IconBtn(
  { iconName, className, loading, forbidden, iconProps = {}, ...restProps }: Props,
  ref?: React.Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button
      {...restProps}
      ref={ref}
      className={cs('btn', 'icon-btn', className, {
        'btn--loading': loading,
        'btn--forbidden': forbidden,
        'opacity-50': forbidden,
        'pointer-events-none': loading,
      })}
      disabled={forbidden}
    >
      <Icon
        name={loading ? 'loading' : iconName}
        className={cs({ 'animate-spin': loading })}
        {...iconProps}
      />
    </button>
  );
}

export default React.forwardRef(IconBtn);
