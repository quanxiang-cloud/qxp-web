import React from 'react';
import SchemaForm, { useForm } from '@formily/antd';
import { Input } from '@formily/antd-components';

import Modal from '@c/modal';

import store from '../store';
import { useEffect } from 'react';

type Props = {
  onClose: () => void;
}

function BuildModal({ onClose }: Props): JSX.Element {
  const SCHEMA: ISchema = {
    type: 'object',
    properties: {
      Fields: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          tag: {
            type: 'string',
            title: '版本号',
            // description: '最多10个字符，只能包含数字、字母、下划线、小数点、且不可重复',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入，例如：v0.1',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入函数版本号',
              },
              {
                pattern: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
                message: '版本号不能输入emoji表情符号',
              },
              {
                pattern: /^[a-zA-Z]+([_.]?[a-zA-Z0-9])*$/,
                message: '必须以字母开头,由字母、数字、单下划线组成',
              },
              {
                max: 10,
                message: '版本号不超过 10 字符，请修改！',
              },
            ],
            'x-index': 0,
          },
          describe: {
            type: 'string',
            title: '描述',
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '选填（不超过 100 字符）',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': {
              max: 100,
              message: '备注超过 100 字符!',
            },
            'x-index': 3,
          },
        },
      },
    },
  };
  const form = useForm({
    onSubmit: (formData) => {
      store.buildFunc(formData);
      onClose();
    },
  });

  function handleSubmit(): void {
    form.submit().then(() => {
      onClose();
    }).catch(() => null);
  }

  return (
    <Modal
      className="static-modal"
      title="构建函数"
      onClose={onClose}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: '确认构建',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <SchemaForm
        className="p-20"
        schema={SCHEMA}
        form={form as any}
        components={{ Input, TextArea: Input.TextArea }}
      />
    </Modal>
  );
}

export default BuildModal;
