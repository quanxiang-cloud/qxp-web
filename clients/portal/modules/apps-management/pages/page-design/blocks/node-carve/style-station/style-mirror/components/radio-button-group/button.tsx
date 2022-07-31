import React, { HTMLAttributes } from 'react';
import cs from 'classnames';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  isActive?: boolean;
}

function RadioButton({ style, className, children, isActive, ...restProps }: Props): JSX.Element {
  return (
    <button
      {...restProps}
      style={style}
      className={cs(
        'flex flex-1 justify-center items-center rounded-6 px-6 py-4 border-1 border-gray-300 duration-300',
        {
          'border-blue-600': isActive,
          'hover:class-station-tag-shadow': !isActive,
        }, className)}
    >
      {children}
    </button>
  );
}

export default RadioButton;
