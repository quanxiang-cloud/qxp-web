import React, { useState, useRef } from 'react';
import Modal from '@c/modal';

import BasicInfoForm from './rights-setting/basic-info-form';

import store from './store';
import toast from '@lib/toast';

type Props = {
  onCancel: () => void;
}

function CreateRightModal({ onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();

  const handleSubmit = (): void => {
    formRef.current?.handleSubmit((rights: RightsCreate) => {
      setLoading(true);
      store.addRightsGroup(rights).then(() => {
        setLoading(false);
        onCancel();
      }).catch((err) => {
        toast.error(err);
        setLoading(false);
      });
    })();
  };

  return (
    <Modal
      className="static-modal"
      title='新建权限组'
      onClose={onCancel}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: '保存',
          key: 'confirm',
          iconName: 'check',
          loading: loading,
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <BasicInfoForm className="p-20" ref={formRef} />
    </Modal>
  );
}

export default CreateRightModal;
