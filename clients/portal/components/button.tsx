import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Loading } from '@QCFE/lego-ui';

interface IButton {
  children: React.ReactNode;
  textClassName?: string;
  className?: string;
  icon?: JSX.Element;
  onClick?: () => void;
  loading?: boolean;
}

export const Button = ({ children, icon, className, textClassName, onClick, loading }: IButton) => {
  return (
    <button
      onClick={onClick}
      className={twCascade(
        'h-3-dot-2 text-center leading-2-dot-5 inline-block border border-gray-700',
        'px-16 rounded-l-8 rounded-tr-2 rounded-br-8 cursor-pointer',
        className,
        {
          'opacity-50': loading,
          'cursor-not-allowed': loading,
          'pointer-events-none': loading,
        }
      )}
    >
      <div className="flex items-center justify-center">
        {loading && (
          <Loading size="20" />
        )}
        {!loading && (
          <>{ icon }</>
        )}
        <div className={twCascade('text-14 ml-dot-4', textClassName)}>{children}</div>
      </div>
    </button>
  );
};
