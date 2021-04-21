import React, { useState, useRef } from 'react';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';

import BasicInfoForm from './right-setting/basic-info-form';

import store from '../store';

type Props = {
  onCancel: () => void
}

function CreateRightModal({ onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();

  const onSubmit = () => {
    formRef.current?.handleSubmit((data1: any) => {
      store.addRight(data1);
      console.log(data1);
    })();
  };

  return (
    <Modal
      visible
      className="static-modal"
      title='新建权限组'
      onCancel={onCancel}
      footer={
        (<div className="flex flex-row justify-between items-center">
          <Button
            className="mr-20"
            iconName="close"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            modifier="primary"
            iconName="check"
            loading={loading}
            onClick={onSubmit}
          >
            保存
          </Button>
        </div>)
      }
    >
      <BasicInfoForm ref={formRef} />
    </Modal>
  );
}

export default CreateRightModal;
