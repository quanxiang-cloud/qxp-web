import React, { ReactNode } from 'react';
import Avatar from '@m/qxp-ui-mobile/avatar';
import './header.scss';
import cs from 'classnames';
import { HomePageProps } from '@m/pages/dashboard/types';

const Header: React.FC<HomePageProps> = (props) => {
  const depName = window.USER?.dep?.departmentName ?? '';

  function renderHeader(): JSX.Element {
    return (
      <div className='safe-area-top header flex w-full title3 items-center'>
        <Avatar name={depName} size='.32rem'/>
        <h3 className='flex-1 truncate'>
          {depName}
        </h3>
      </div>
    );
  }

  function renderWrapper(children: ReactNode): JSX.Element {
    return (
      <div className={cs('h-full flex flex-col', { hidden: !props.active })}>
        {renderHeader()}
        <div className='flex-1 overflow-scroll'>
          {children}
        </div>
      </div>
    );
  }

  if (props.children) {
    return renderWrapper(props.children);
  }

  return renderHeader();
};

export default Header;
