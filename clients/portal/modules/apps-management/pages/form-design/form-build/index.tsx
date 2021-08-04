import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { FormButtonGroup } from '@formily/antd';

import Modal from '@c/modal';
import Button from '@c/button';
import toast from '@lib/toast';
import { FormBuilder, FormRenderer } from '@c/form-builder';

import store from '../store';

const FormPage = () => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const history = useHistory();

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
          iconName='preview'
          onClick={() => setPreviewModalVisible(true)}
        >
          预览
        </Button>
        <Button
          iconName='save'
          modifier="primary"
          onClick={() => store.saveFormScheme(history)}
        >
          保存表单
        </Button>
        {/* <span className='text-underline-no-color cursor-pointer'>
          🎬 查看新手指引
        </span> */}
      </div>
      <FormBuilder store={store.formStore} />
      {previewModalVisible && (
        <Modal title="预览表单" onClose={handlePreviewClose}>
          <FormRenderer
            className="w-800 p-20"
            schema={store.formStore.schema}
            onSubmit={(value) => toast.success('提交表单：' + JSON.stringify(value))}
          >
            <FormButtonGroup offset={8}>
              <Button type="submit" modifier="primary">模拟提交</Button>
              <Button type="submit" onClick={handlePreviewClose}>关闭</Button>
            </FormButtonGroup>
          </FormRenderer>
        </Modal>
      )}
    </>
  );
};

export default observer(FormPage);
