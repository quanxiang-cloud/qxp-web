import React, { useRef } from 'react';
import { inject } from 'mobx-react';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button2';

import CreatedEditApp from './created-edit-app';

type Props = {
  onCancel: () => void;
}

function CreatedAppModal({ onCancel, appListStore }: Props) {
  const formRef:any = useRef(null);

  const handleSubmit = () => {
    const formDom = formRef.current;
    if (formDom.validateFields()) {
      const data = formDom.getFieldsValue();
      data.appIcon = JSON.stringify(data.appIcon);
      appListStore.createdApp(data).then(()=>{
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
        <div className="flex items-center">
          <Button icon='close' onClick={onCancel}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            isPrimary
            icon='check'
            onClick={handleSubmit}
          >
            确定
          </Button>
        </div>
      }
    >
      <CreatedEditApp ref={formRef} />
    </Modal>
  );
}

export default inject('appListStore')(CreatedAppModal);
