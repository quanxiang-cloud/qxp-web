import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Modal from '@c/modal';
import toast from '@lib/toast';

import CreatedEditApp from './created-edit-app';
import store from '../store';

type Props = {
  onCancel: () => void;
}

function CreatedAppModal({ onCancel }: Props): JSX.Element {
  const history = useHistory();
  const formRef: any = useRef(null);

  const handleSubmit = (): void => {
    const formDom = formRef.current;
    formDom.submit();
  };

  function submitCallback(): void {
    const formDom = formRef.current;
    const data = formDom.getFieldsValue();
    store.createdApp({ ...data, useStatus: -1 }).then((res: string) => {
      toast.success('创建应用成功！');
      onCancel();
      history.push(`/apps/details/${res}/page_setting`);
    }).catch((e) => {
      toast.error(e.message);
    });
  }

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
      <CreatedEditApp className="p-20" ref={formRef} onSubmitCallback={submitCallback} />
    </Modal>
  );
}

export default CreatedAppModal;
