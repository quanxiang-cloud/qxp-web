import React from 'react';
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'

interface ButtonProps {
  children: React.ReactNode;
  textClassName?: string;
  className?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

export const Button = (props: ButtonProps) => {
  const { children, icon, className, textClassName, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={
        classnames('h-1-dot-6 text-center leading-1-dot-3 inline-block border border-334155 px-dot-8 py-dot-125 rounded-l-dot-4 rounded-tr-dot-1 rounded-br-dot-4', className,useCss({
          "&:hover": {
            'cursor': 'pointer',
          }
        }))
      }
    >
      <div className="flex items-center">
        {icon}
        <div className={classnames('text-dot-7', textClassName)}>{children}</div>
      </div>
    </div>
  )
}