import React, { useRef } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Button from '@c/button';

import store from '../store';
import '../index.scss';

type Props = {
  appInfo: AppInfo;
  onCancel: () => void;
}

function DeleteAppModal({ onCancel, appInfo }: Props) {
  const ref: any = useRef();
  const handleSubmit = () => {
    const formRef = ref.current;
    if (formRef.validateFields()) {
      store.delApp(appInfo.id).then(() => {
        onCancel();
      });
    }
  };

  return (
    <Modal
      visible
      title='删除应用'
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
            删除应用
          </Button>
        </div>)
      }
    >
      <div className='flex-1'>
        <p className='app-del-title'>
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='sms_failed' />
          确定要删除应用 {appInfo.appName} 吗？
        </p>
        <Form layout='vertical' ref={ref}>
          <Form.TextField
            name='appName'
            placeholder='请输入应用名称，以确认要删除'
            schemas={[
              {
                help: '请输入应用名称',
                rule: { required: true },
              },
              {
                help: '应用名称输入错误',
                rule: (value: string) => value === appInfo.appName,
              },
            ]}
          />
        </Form>
      </div>
    </Modal>
  );
}

export default DeleteAppModal;
