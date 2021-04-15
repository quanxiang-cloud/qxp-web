import React from 'react';
import { useParams } from 'react-router-dom';

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
      {pageType === 'formBuild' && (<FormBuild />)}
      {pageType === 'pageSetting' && (<PageSetting />)}
      {pageType === 'publishForm' && (<PublishForm />)}
    </div>
  );
}

export default FormDesign;
