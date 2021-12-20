import React from 'react';
import cs from 'classnames';
import { LinkProps } from './types';
import { useHistory } from 'react-router-dom';

export default function Link({
  href, target,
  className, style, children,
}: LinkProps): JSX.Element {
  if (target !== '_history') {
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
      onClick={() => history.push(href ?? '')}
      className={cs('link', className)}
      style={style}
    >
      {children}
    </div>
  );
}
