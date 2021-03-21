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
        'text-center leading-1-dot-3 inline-block border border-334155',
        'px-dot-8 py-1 rounded-l-dot-4 rounded-tr-dot-1 rounded-br-dot-4 cursor-pointer',
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
        <div className={twCascade('text-dot-7 ml-dot-4', textClassName)}>{children}</div>
      </div>
    </button>
  );
};
