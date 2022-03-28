import React, { ReactNode } from 'react';
import cs from 'classnames';

import Avatar from '@m/qxp-ui-mobile/avatar';
import { HomePageProps } from '../types';

import './header.scss';
import { getUserDepartment } from '@lib/utils';

const Header: React.FC<HomePageProps> = (props) => {
  const { name: depName } = getUserDepartment(window.user);

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
