import React, { forwardRef, Ref } from 'react';
import classnames from 'classnames';

import SvgIcon from '@c/icon';

interface Props extends React.DetailedHTMLProps<
React.ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
>{
  modifier?: 'primary' | 'loading' | 'forbidden';
  iconName?: string;
  iconSize?: number;
}

function Button(
  { children, iconName, className, modifier = 'primary', iconSize, ...rest }: Props,
  ref?: Ref<HTMLButtonElement>
) {
  return (
    <button
      {...rest}
      ref={ref}
      className={classnames('btn', className, `btn-${modifier}`, {
        'cursor-not-allowed': modifier === 'forbidden',
        'opacity-50': modifier === 'forbidden',
        'pointer-events-none': modifier === 'loading' || modifier === 'forbidden',
      })}
    >
      {iconName && (
        <SvgIcon
          name={iconName}
          type={modifier === 'primary' ? 'light' : 'dark'}
          disabled={modifier === 'forbidden'}
          size={iconSize || 20}
          className="fill-current text-inherit mr-8"
        />
      )}
      {children}
    </button>
  );
}

export default forwardRef(Button);
