import React, { useState } from 'react';
import { observer } from 'mobx-react';
import store from '../store';

import { FormBuilder } from '@c/form-builder';
import registry from '@c/form-builder/registry';
import Button from '@c/button';

import { Modal, Message } from '@QCFE/lego-ui';

import { SchemaForm } from '@formily/antd';

const FormPage = () => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [tempFormValue, setTempFormValue] = useState({});

  if (!store.formStore) {
    return null;
  }

  const handleSimulateSubmit = () => {
    Message.success('提交表单：' + JSON.stringify(tempFormValue));
  };

  const handleFormChange = (value: React.SetStateAction<{}>) => {
    setTempFormValue(value);
  };

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
      <Modal
        title="预览表单"
        onOk={handleSimulateSubmit}
        onCancel={handlePreviewClose}
        visible={previewModalVisible}
        footer={
          (<div>
            <Button
              className="mr-16"
              onClick={handlePreviewClose}
            >
              关闭
            </Button>
            <Button
              modifier="primary"
              onClick={handleSimulateSubmit}
            >
              模拟提交
            </Button>
          </div>
          )
        }
      >
        <SchemaForm
          className="w-588"
          components={{ ...registry.components }}
          schema={store.formStore.schemaForPreview}
          onChange={handleFormChange}
        />
      </Modal>
    </>
  );
};

export default observer(FormPage);
