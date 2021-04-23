import React, { cloneElement } from 'react';
import cs from 'classnames';

interface Props {
  separator?: React.ReactNode
  children: string | JSX.Element
  style?: React.CSSProperties
  className?: string
}

export default function BreadcrumbItem({
  separator,
  children,
  className,
  style,
}: Props) {
  const childrenRender = () => {
    if (typeof children === 'string') {
      return <span>{children}</span>;
    } else {
      return (
        cloneElement(children, {
          className: cs(className, 'qxp-breadcrumb-link'),
        })
      );
    }
  };

  if (!children) {
    return null;
  }
  return (
    <div
      style={style}
      className={cs(className, 'qxp-breadcrumb-item')}
    >
      {childrenRender()}
      <span className="qxp-breadcrumb-separator">{separator}</span>
    </div>
  );
}
