import React, { MouseEvent, MouseEventHandler, forwardRef, Ref } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Loading, Icon } from '@QCFE/lego-ui';

export type ButtonType = 'primary' | 'secondary' | 'disabled';

interface Props {
  type?: ButtonType;
  icon?: JSX.Element;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  htmlType?: 'submit' | 'reset' | 'button';
}

type CompoundedComponent = React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>

function Button({
  type, children, icon, className, textClassName, onClick, loading, htmlType = 'button', ...rest
}: Props, ref?: Ref<HTMLButtonElement>) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      return;
    }
    onClick && onClick(e);
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={htmlType}
      onClick={handleClick}
      className={twCascade(
        'h-32 text-center leading-25 inline-block border border-gray-700',
        'px-16 rounded-l-8 rounded-tr-2 rounded-br-8 cursor-pointer btn',
        className,
        {
          'opacity-50': loading,
          'cursor-not-allowed': loading,
          'pointer-events-none': loading,
          'btn-loading': loading,
          [`btn-${type}`]: type,
        }
      )}
    >
      <span className="flex items-center justify-center">
        {loading && (
          <Loading size="20" />
        )}
        {!loading && icon && (
          <>{icon}</>
        )}
        {!loading && typeof icon === 'string' && (
          <Icon name={icon} type={type === 'primary' ? 'light' : 'dark'} />
        )}
        <span className={twCascade('text-14', textClassName)}>{children}</span>
      </span>
    </button>
  );
}

export default forwardRef<HTMLButtonElement, Props>(Button) as CompoundedComponent;
