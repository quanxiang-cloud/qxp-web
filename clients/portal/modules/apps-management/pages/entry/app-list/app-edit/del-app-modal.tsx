import React from 'react';
import { Form, Input } from 'antd';

import Modal from '@c/modal';
import Icon from '@c/icon';

import store from '../store';

import '../index.scss';

type Props = {
  appInfo: AppInfo;
  onCancel: () => void;
}

function DeleteAppModal({ onCancel, appInfo }: Props) {
  const [form] = Form.useForm();

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(): void {
    store.delApp(appInfo.id).then(() => {
      onCancel();
    });
  }

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
        <p className='app-del-title mb-8'>
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='sms_failed' />
          确定要删除应用 {appInfo.appName} 吗？
        </p>
        <Form layout='vertical' form={form} onFinish={handleFinish}>
          <Form.Item
            name="appName"
            rules={[
              {
                required: true,
                message: '请输入应用名称',
              }, {
                validator: (rule, value) => {
                  if (!value) {
                    return Promise.resolve();
                  } else if (value !== appInfo.appName) {
                    return Promise.reject(new Error('应用名称输入错误'));
                  } else {
                    return Promise.resolve();
                  }
                },
              }]}
          >
            <Input placeholder='请输入应用名称，以确认要删除' />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default DeleteAppModal;
