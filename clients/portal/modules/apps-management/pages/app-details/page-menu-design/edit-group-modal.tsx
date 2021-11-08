import React from 'react';
import { Form, Input } from 'antd';

import Modal from '@c/modal';

import store from '../store';
import { MenuType } from '../type';

type Props = {
  onCancel: () => void;
  onSubmit: (groupInfo: PageInfo) => Promise<unknown>;
  groupInfo: PageInfo;
};

function EditGroupModal({ groupInfo, onCancel, onSubmit }: Props): JSX.Element {
  const [form] = Form.useForm();
  const otherGroupNames = store.pageInitList.filter((pageInfo: PageInfo) => (
    pageInfo.menuType === MenuType.group && pageInfo.id !== groupInfo.id
  )).map((pageInfo: PageInfo) => pageInfo.name);

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    onSubmit({ ...(groupInfo || {}), ...values }).then(() => {
      onCancel();
    });
  }

  function validateRepeat(value: string): boolean {
    return otherGroupNames.includes(value);
  }

  return (
    <Modal
      title={groupInfo.id ? '修改分组名称' : '新建分组'}
      onClose={onCancel}
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
        text: '确定',
      }]}
    >
      <Form
        className="p-20"
        layout='vertical'
        form={form}
        onFinish={handleFinish}
        initialValues={{
          name: groupInfo.name,
        }}
      >
        <Form.Item
          name="name"
          extra="不超过 30 个字符，分组名称不可重复。"
          rules={[
            {
              required: true,
              message: '请输入分组名称',
            }, {
              type: 'string',
              max: 30,
              message: '不能超过30个字符',
            }, {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                } else if (validateRepeat(value)) {
                  return Promise.reject(new Error('分组名称重复'));
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入分组名称' />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditGroupModal;
