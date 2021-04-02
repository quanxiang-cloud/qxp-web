import React, { useRef } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import Button from '@c/button';
import { Tab } from '@c/tab2';

import AppAdminSelect from './app-admin-select';
import CreatedEditApp from './created-edit-app';
import '../index.scss';

type Props = {
  appInfo: any;
  onCancel: () => void;
}

function AppSettingModal({ onCancel, appInfo }: Props) {
  const ref = useRef();
  const handleSubmit = () => {
    const formRef: any = ref.current;
    if (formRef.validateFields()) {
      console.log(formRef.getFieldsValue());
    }
  };

  return (
    <Modal
      visible
      title='应用设置'
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
            保存设置
          </Button>
        </div>
      }
    >
      <Tab
        style={{ height: 'calc(100% - 24px)' }}
        className="mt-4 py-1-dot-6"
        items={[
          {
            id: 'basic',
            name: '基础信息',
            content: (<CreatedEditApp/>),
          },
          {
            id: 'appAdmin',
            name: '应用管理员',
            content: (<AppAdminSelect />),
          },
        ]}
      />
    </Modal>
  );
}

export default AppSettingModal;

