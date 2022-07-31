import React from 'react';
import { Form, Input } from 'antd';

import Modal from '@c/modal';

import store from './store';

const { Item } = Form;

interface Props {
  templateKey: string;
  onClose: () => void;
}

export default function RenameTemplateModal({ templateKey, onClose }: Props): JSX.Element | null {
  const template = store.pageTemplates.find(({ key }) => key === templateKey);
  const [form] = Form.useForm();

  function handleFinish({ name }: { name: string }): void {
    store.renameTemplate(templateKey, name).then(onClose);
  }

  if (!template) {
    return null;
  }

  return (
    <Modal
      title="修改页面模版名称"
      onClose={onClose}
      footerBtns={[
        {
          key: 'cancel',
          text: '取消',
          onClick: onClose,
        },
        {
          key: 'save',
          text: '保存',
          modifier: 'primary',
          onClick: () => form.submit(),
        },
      ]}
    >
      <Form
        className="p-20"
        layout="vertical"
        form={form}
        initialValues={{ name: template.name }}
        onFinish={handleFinish}
      >
        <Item
          name="name"
          label="模版名称"
          extra={<span className="text-12 pt-4">不超过 30 个字符</span>}
          required
          rules={[
            {
              type: 'string',
              max: 30,
              message: '名称不超过 30 字符，请修改！',
            },
            {
              validator: (_, value) => {
                if (!value.trim()) {
                  return Promise.reject(new Error('名称不能为空'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入模版名称" maxLength={30} />
        </Item>
      </Form>
    </Modal>
  );
}
