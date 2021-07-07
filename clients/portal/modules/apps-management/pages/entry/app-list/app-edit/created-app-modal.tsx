import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@c/modal';

import toast from '@lib/toast';

import CreatedEditApp from './created-edit-app';
import store from '../store';

type Props = {
  onCancel: () => void;
}

function CreatedAppModal({ onCancel }: Props) {
  const history = useHistory();
  const formRef: any = useRef(null);

  const handleSubmit = () => {
    const formDom = formRef.current;
    if (formDom.validateFields()) {
      const data = formDom.getFieldsValue();
      data.appIcon = JSON.stringify(data.appIcon);
      store.createdApp({ ...data, useStatus: -1 }).then((res: string) => {
        toast.success('创建应用成功！');
        onCancel();
        history.push(`/apps/details/${res}`);
      }).catch((e) => {
        toast.error(e.message);
      });
    }
  };

  return (
    <Modal
      title='新建应用'
      onClose={onCancel}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <CreatedEditApp ref={formRef} />
    </Modal>
  );
}

export default CreatedAppModal;
