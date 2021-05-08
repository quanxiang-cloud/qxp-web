import React, { useState } from 'react';
import { observer } from 'mobx-react';
import store from '../store';

import { FormBuilder } from '@c/form-builder';
import registry from '@c/form-builder/registry';
import Button from '@c/button';

import Modal from '@c/modal2';

import { FormButtonGroup, SchemaForm } from '@formily/antd';
import toast from '@lib/toast';

const FormPage = () => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  if (!store.formStore) {
    return null;
  }

  const handlePreviewClose = () => {
    setPreviewModalVisible(false);
  };

  return (
    <>
      <div className='form-design-tool'>
        <Button
          iconName='save'
          modifier="primary"
          onClick={(store.hasSchema ? store.updateFormScheme : store.createFormScheme)}
        >
          保存表单
        </Button>
        <Button iconName='preview' onClick={() => setPreviewModalVisible(true)}>
          预览
        </Button>
        {/* <span className='text-underline-no-color cursor-pointer'>
          🎬 查看新手指引
        </span> */}
      </div>
      <FormBuilder store={store.formStore} />
      {previewModalVisible && (
        <Modal title="预览表单" onClose={handlePreviewClose}>
          <SchemaForm
            className="w-588"
            components={{ ...registry.components }}
            schema={store.formStore.schemaForPreview}
            onSubmit={(value) => {
              toast.success('提交表单：' + JSON.stringify(value));
            }}
          >
            <FormButtonGroup offset={4}>
              <Button type="submit" modifier="primary">模拟提交</Button>
              <Button type="submit" onClick={handlePreviewClose}>关闭</Button>
            </FormButtonGroup>
          </SchemaForm>
        </Modal>
      )}
    </>
  );
};

export default observer(FormPage);
