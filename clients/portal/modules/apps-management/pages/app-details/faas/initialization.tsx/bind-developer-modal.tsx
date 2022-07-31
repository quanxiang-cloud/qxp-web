import React from 'react';
import SchemaForm, { useForm, createFormActions } from '@formily/antd';
import { Radio, Input } from '@formily/antd-components';

import Icon from '@c/icon';
import Modal from '@c/modal';

import store from './store';

const SCHEMA = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        account: {
          type: 'string',
          title: '账号',
          required: true,
          'x-component-props': {
            placeholder: '请输入账号',
          },
          'x-rules': [
            {
              required: true,
              message: '请输入Gitlab账号',
            },
          ],
          'x-component': 'Input',
          'x-index': 0,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

const actions = createFormActions();

function BindDeveloperModal(): JSX.Element {
  const form = useForm({
    actions,
    onSubmit: (formData) => store.createDeveloper(formData),
  });

  return (
    <Modal
      title='绑定Git仓库账户'
      onClose={() => store.setModalType('')}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          onClick: () => store.setModalType(''),
        },
        {
          text: '保存',
          key: 'next',
          modifier: 'primary',
          onClick: () => form.submit(),
        },
      ]}
    >
      <div
        className='rounded-12 rounded-tl-4 flex items-center bg-blue-100 text-blue-600 py-10 px-16 my-20 mx-16'
      >
        <Icon name='info' size={18} />
        <span className='ml-10 text-12'>
          当前版本Git仓库仅支持Gitlab
        </span>
      </div>
      <SchemaForm
        className="pt-8 pb-24 px-20"
        schema={SCHEMA}
        form={form as any}
        components={{ Input, TextArea: Input.TextArea, RadioGroup: Radio.Group }}
      />
    </Modal>
  );
}

export default BindDeveloperModal;
