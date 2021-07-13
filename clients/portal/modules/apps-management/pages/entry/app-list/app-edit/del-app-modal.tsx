import React, { useRef } from 'react';
import { Form } from '@QCFE/lego-ui';

import Modal from '@c/modal';
import Icon from '@c/icon';

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
      title='删除应用'
      onClose={onCancel}
      className="static-modal"
      footerBtns={[{
        key: 'close',
        iconName: 'close',
        onClick: onCancel,
        text: '取消',
      }, {
        key: 'check',
        iconName: 'check',
        modifier: 'primary',
        onClick: handleSubmit,
        text: '删除应用',
      }]}
    >
      <div className='flex-1 p-20'>
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
