import React from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';

import { LinkProps } from './types';

export default function Link({
  href, target, onClick,
  className, style, children,
}: LinkProps): JSX.Element {
  if (target !== '_history' && !onClick) {
    return (
      <a
        href={href}
        target={target}
        rel='noreferrer'
        className={cs('link', className)}
        style={style}
      >
        {children}
      </a>
    );
  }

  const history = useHistory();

  return (
    <div
      onClick={onClick ?? (() => history.push(href ?? ''))}
      className={cs('link', className)}
      style={style}
    >
      {children}
    </div>
  );
}
