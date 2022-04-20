import React from 'react';

import ViewLayout from './view-layout';

function LayoutManagement(): JSX.Element {
  // todo get pageDescriptions and related
  return (
    <div className='flex flex-col h-full flex-1 relative overflow-hidden rounded-8 bg-white'>
      <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex items-center bg-gray-50'>
        <span className='text-12 mr-8 font-semibold flex justify-between'>母版管理</span>
        <span className='text-caption align-top'>可自定义设计版式，为应用内其他页面共用，拥有一次设计多处复用的特性</span>
      </div>
      <ViewLayout />
    </div>
  );
}

export default LayoutManagement;
