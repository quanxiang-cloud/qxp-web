import React from 'react';
import SchemaForm, { useForm } from '@formily/antd';
import { Input } from '@formily/antd-components';

import Modal from '@c/modal';

type Props = {
  modalType: string;
  onClose: () => void;
}

function EditModal({ modalType, onClose }: Props): JSX.Element {
  const SCHEMA: ISchema = {
    type: 'object',
    properties: {
      Fields: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          title: {
            type: 'string',
            title: '新建函数',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入，例如：计算函数',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入函数名称',
              },
              {
                pattern: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
                message: '名称不能输入emoji表情符号',
              },
              {
                max: 30,
                message: '名称不超过 30 字符，请修改！',
              },
            ],
            'x-index': 0,
          },
          funcID: {
            type: 'string',
            title: '函数标识',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入，例如：sys_001',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入函数标识',
              },
              {
                max: 30,
                message: '函数标识不超过 30 字符，请修改！',
              },
              {
                pattern: /^[a-zA-Z]+([_]?[a-zA-Z0-9])*$/,
                message: '必须以字母开头,由字母、数字、单下划线组成',
              },
            ],
            'x-index': 1,
          },
          language: {
            type: 'string',
            title: '语言',
            default: 'Go语言',
            readOnly: true,
            'x-component': 'Input',
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-index': 2,
          },
          description: {
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
      console.log(formData);
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
      title={`${modalType === 'edit' ? '修改' : '新建'}函数`}
      onClose={onClose}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: `${modalType === 'edit' ? '确定修改' : '确定添加'}`,
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

export default EditModal;
