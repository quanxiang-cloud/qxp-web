import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import cs from 'classnames';

import Icon from '@c/icon';

interface Props {
  iconName?: string;
  className?: string;
  to?: string;
  isActive?: boolean;
  render?: () => JSX.Element;
  text?: string;
  cache?: boolean;
}

function NavButton({
  to, isActive = false, text,
  className: cls, iconName, render,
}: Props) {
  function className(isActive: boolean) {
    if (isActive) {
      return {
        'bg-blue-100': isActive,
      };
    }
  }

  function style(isActive: boolean) {
    if (isActive) {
      return {
        color: 'var(--blue-600)',
      };
    }
    return {};
  }

  const navContent = (
    <>
      <div className="header-nav-btn-icon-wrapper">
        <Icon
          name={iconName || ''}
          className="group-hover:text-blue-600 header-nav-btn-icon"
          style={style(isActive)}
          size={20}
        />
      </div>
      <span
        className="header-nav-btn-text group-hover:text-blue-600"
        style={style(isActive)}
      >
        {text}
      </span>
    </>
  );

  return (
    <>
      {to && (
        <Link
          to={to}
          className={cs(
            'header-nav-btn group mr-20',
            className(isActive),
            cls,
          )}
        >
          {navContent}
        </Link>
      )}
      {!to && (
        <div className={cs('header-nav-btn group', cls)}>
          {render ? render() : navContent}
        </div>
      )}
    </>
  );
}

export default memo(NavButton, (prevProps, nextProps) => {
  return !!nextProps.cache;
});
