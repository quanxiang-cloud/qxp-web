import React, { isValidElement, ReactElement, useRef } from 'react';
import cs from 'classnames';

import useHeight from '../utils/hooks/use-height';
import { getZIndexStyle } from '../utils/format/unit';
import Icon from '../icon';

import { NavBarProps } from './types';

const NavBar: React.FC<NavBarProps> = (props) => {
  const {
    onClickLeft,
    onClickRight,
    leftText,
    leftArrow,
    rightText,
    fixed,
    placeholder,
    safeAreaInsetTop = true,
    title,
    zIndex,
  } = props;

  const navBarRef = useRef(null);

  const navBarHeight = useHeight(navBarRef);

  const renderLeft = (): React.ReactNode => {
    if (typeof leftText !== 'string' && isValidElement(leftText)) {
      return leftText;
    }

    return [
      !!leftArrow && (<Icon key="nav-bar__arrow"
        className='nav-bar__arrow'
        name="keyboard_backspace"
        size='.24rem' />),
      !!leftText && (
        <span key="nav-bar__text" className='text'>
          {leftText}
        </span>
      ),
    ];
  };

  const renderRight = (): React.ReactNode => {
    if (typeof rightText !== 'string' && isValidElement(rightText)) {
      return rightText;
    }

    return <span className='text'>{rightText}</span>;
  };

  const renderNavBar = (): ReactElement => {
    const style = getZIndexStyle(zIndex, props.style);

    const hasLeft = leftArrow || !!leftText;
    const hasRight = !!rightText;

    return (
      <div
        ref={navBarRef}
        style={style}
        className={cs('nav-bar', { 'nav-bar--fixed': fixed, 'safe-area-inset-top': safeAreaInsetTop },
          props.className,
        )}
      >
        <div className='nav-bar__content text-primary'>
          {hasLeft && (
            <div className='nav-bar__left' onClick={onClickLeft}>
              {renderLeft()}
            </div>
          )}
          <div className='nav-bar__title title3 truncate'>{title}</div>
          {hasRight && (
            <div className='nav-bar__right' onClick={onClickRight}>
              {renderRight()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPlaceholder = (): React.ReactNode => {
    if (fixed && placeholder) {
      return (
        <div
          className='nav-bar__placeholder'
          style={{ height: navBarHeight ? `${navBarHeight}px` : undefined }}
        />
      );
    }
    return null;
  };

  return (
    <>
      {renderPlaceholder()}
      {renderNavBar()}
    </>
  );
};

export default NavBar;
