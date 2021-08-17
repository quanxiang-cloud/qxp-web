import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { FormButtonGroup } from '@formily/antd';
import cs from 'classnames';
import { useCss } from 'react-use';

import Modal from '@c/modal';
import Button from '@c/button';
import toast from '@lib/toast';
import { FormBuilder, FormRenderer } from '@c/form-builder';

import store from '../store';

const FormPage = (): JSX.Element | null => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const history = useHistory();
  const formClassName = useCss({
    '.mega-layout-container-content': { width: '100%' },
    '.ant-col-4+.ant-form-item-control': { width: '83%' },
  });

  if (!store.formStore) {
    return null;
  }

  const handlePreviewClose = (): void => {
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
            className={cs('w-800 p-20', formClassName)}
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
