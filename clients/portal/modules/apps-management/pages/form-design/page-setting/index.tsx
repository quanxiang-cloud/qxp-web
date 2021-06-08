import React from 'react';
import { observer } from 'mobx-react';

import FormAppDataTableContent from '@c/form-app-data-table/form-app-data-content';
import Button from '@c/button';

import PageSettingConfig from './page-setting-config';
import store from '../store';

import './index.scss';

function PageSetting() {
  return (
    <>
      <div className='form-design-tool'>
        <span className='text-underline-no-color cursor-pointer flex-1'>
          🎬 查看新手指引
        </span>
        <Button onClick={store.savePageConfig} iconName='save' modifier="primary">
          保存页面设置
        </Button>
      </div>
      <div className='flex-1 flex  overflow-hidden'>
        <div className='flex-1 p-20 overflow-hidden'>
          <p className='text-caption-no-color text-gray-400 mb-8'>预览页面视图</p>
          <FormAppDataTableContent store={store.appPageStore} />
        </div>
        <PageSettingConfig />
      </div>
    </>
  );
}

export default observer(PageSetting);
