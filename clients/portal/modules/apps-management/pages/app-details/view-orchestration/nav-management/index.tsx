import React from 'react';

import AppNav from './app-nav';

function NavManagement(): JSX.Element {
  // todo get pageDescriptions and related
  return (
    <div className='flex flex-col h-full flex-1 relative overflow-hidden rounded-8 bg-white'>
      <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex items-center bg-gray-50'>
        <span className='text-12 mr-8 font-semibold flex justify-between'>应用导航</span>
        <span className='text-caption align-top'>预设有Logo位、菜单项和个人，位于所有页面固定位置，拥有点击链接只加载页面内容的特性</span>
      </div>
      <AppNav />
    </div>
  );
}

export default NavManagement;
