import React from 'react';

import AppPageData from '@appC/app-page-data';
import Button from '@c/button';

import PageSettingConfig from './page-setting-config';

import store from '../store';

import './index.scss';

function PageSetting() {
  return (
    <>
      <div className='form-design-tool'>
        <Button iconName='save' modifier="primary">
          保存表单
        </Button>
        <Button iconName='preview'>
          预览
        </Button>
        <span className='text-underline-no-color cursor-pointer'>
          🎬 查看新手指引
        </span>
      </div>
      <div className='flex-1 flex overflow-hidden'>
        <div className='flex-1 p-20'>
          <p className='text-caption-no-color text-gray-400 mb-8'>预览页面视图</p>
          <AppPageData />
        </div>
        <PageSettingConfig />
      </div>
    </>
  );
}

export default PageSetting;
