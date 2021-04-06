import React, { cloneElement } from 'react';
import classnames from 'classnames';
import BreadcrumbItem from './breadcrumb-item';

interface Props {
    separator?: React.ReactNode
    style?: React.CSSProperties
    className?: string
    children: JSX.Element | JSX.Element[]
}

function Breadcrumb({
  separator = '/',
  children,
  className,
  style,
  ...restProps
}:Props) {
  const crumbRender = React.Children.map(children, (child, idx) => {
    if (!child) {
      return child;
    }
    return cloneElement(child, {
      separator,
      key: idx,
    });
  });

  return (
    <div className={classnames('qxp-breadcrumb', className)} style={style} {...restProps}>
      <ul>{crumbRender}</ul>
    </div>
  );
}

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
