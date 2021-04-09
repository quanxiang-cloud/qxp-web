import React from 'react';

import PageSettingConfig from './page-setting-config';

import './index.scss';

function PageSetting() {
  return (
    <div className='flex-1 flex overflow-hidden'>
      <div className='flex-1 p-20'>
        <p className='text-caption-no-color text-gray-400'>预览页面视图</p>
      </div>
      <PageSettingConfig />
    </div>
  );
}

export default PageSetting;
