import React from 'react';
import { useParams } from 'react-router-dom';

import Button from '@appC/button';

import FormBuild from './form-build';
import PageSetting from './page-setting';
import PublishForm from './publish-form';
import FormDesignHeader from './header';

import './index.scss';

function FormDesign() {
  const { pageType } = useParams<any>();
  return (
    <div style={{ height: '100vh' }} className='flex flex-col'>
      <FormDesignHeader />
      {pageType !== 'publishForm' && (
        <div className='form-design-tool'>
          <Button isPrimary icon='save'>
            保存表单
          </Button>
          <Button icon='preview'>
            预览
          </Button>
          <span className='text-underline-no-color cursor-pointer'>
            🎬 查看新手指引
          </span>
        </div>
      )}
      {pageType === 'formBuild' && (<FormBuild />)}
      {pageType === 'pageSetting' && (<PageSetting />)}
      {pageType === 'publishForm' && (<PublishForm />)}
    </div>
  );
}

export default FormDesign;
