import React, { useRef } from 'react';
import { inject } from 'mobx-react';
import { Modal, Message } from '@QCFE/lego-ui';

import Button from '@c/button';

import CreatedEditApp from './created-edit-app';

type Props = {
  onCancel: () => void;
  appListStore?: any;
}

function CreatedAppModal({ onCancel, appListStore }: Props) {
  const formRef: any = useRef(null);

  const handleSubmit = () => {
    const formDom = formRef.current;
    if (formDom.validateFields()) {
      const data = formDom.getFieldsValue();
      data.appIcon = JSON.stringify(data.appIcon);
      appListStore.createdApp({ ...data, useStatus: -1 }).then(() => {
        Message.success({ content: '创建应用成功！' });
        onCancel();
      });
    }
  };

  return (
    <Modal
      visible
      title='新建应用'
      onCancel={onCancel}
      className="static-modal"
      footer={
        (<div className="flex items-center">
          <Button iconName='close' onClick={onCancel} className="mr-20">
            取消
          </Button>
          <Button
            modifier='primary'
            iconName='check'
            onClick={handleSubmit}
          >
            确定
          </Button>
        </div>)
      }
    >
      <CreatedEditApp ref={formRef} />
    </Modal>
  );
}

export default inject('appListStore')(CreatedAppModal);
