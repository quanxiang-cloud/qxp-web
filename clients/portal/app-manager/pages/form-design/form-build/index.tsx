import React from 'react';
import { observer } from 'mobx-react';

import { FormBuilder } from '@c/form-builder';
import Button from '@c/button';

import store from '../store';

const FormPage = () => {
  if (!store.formStore) {
    return null;
  }

  const hasScheme = !!store.formMetadata.id;

  return (
    <>
      <div className='form-design-tool'>
        <Button
          iconName='save'
          modifier="primary"
          onClick={(hasScheme ? store.updateFormScheme : store.createFormScheme)}
        >
          保存表单
        </Button>
        <Button iconName='preview'>
          预览
        </Button>
        <span className='text-underline-no-color cursor-pointer'>
          🎬 查看新手指引
        </span>
      </div>
      <FormBuilder store={store.formStore} />
    </>
  );
};

export default observer(FormPage);
