import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@c/modal';

import toast from '@lib/toast';
import Button from '@c/button';
import { createPage } from '@portal/modules/apps-management/lib/api';

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
        createPage({ describe: '补充说明信息。', icon: 'event_available', name: '示例页面', appID: res });
        history.push(`/apps/details/${res}`);
      });
    }
  };

  return (
    <Modal
      title='新建应用'
      onClose={onCancel}
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

export default CreatedAppModal;
