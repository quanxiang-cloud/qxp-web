import React from 'react';

import NavButton from '@appC/nav-button';

import AppDropdown from './app-dropdown';
import './index.scss';

function DetailsHeader() {
  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        <NavButton {...{ name: '工作台', icon: 'add_task', inside: true, url: '/' }} />
        <span className='mr-16 ml-8'>/</span>
        <AppDropdown />
      </div>
    </div>
  );
}

export default DetailsHeader;
