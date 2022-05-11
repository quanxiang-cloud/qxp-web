import React from 'react';
import SchemaForm, { useForm } from '@formily/antd';
import { Input, Select as AntdSelect } from '@formily/antd-components';

import Modal from '@c/modal';

import store from '../store';
import EnvList from '../component/env-list';

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
          version: {
            type: 'string',
            title: '版本号',
            // description: '最多10个字符，只能包含数字、字母、下划线、小数点、且不可重复',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入，例如：v1',
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
                pattern: /^[a-z0-9]*$/,
                message: '必须以小写字母、数字组成',
              },
              {
                max: 10,
                message: '版本号不超过 10 字符，请修改！',
              },
            ],
            'x-index': 0,
          },
          env: {
            type: 'array',
            title: '环境变量',
            'x-component': 'EnvList',
            'x-mega-props': {
              labelAlign: 'top',
            },
            items: {
              type: 'object',
              properties: {
                envName: {
                  type: 'string',
                  'x-component': 'Input',
                  title: 'key',
                  'x-component-props': {
                    placeholder: '请输入环境变量名',
                  },
                  'x-mega-props': {
                    labelAlign: 'left',
                  },
                },
                envValue: {
                  type: 'string',
                  'x-component': 'Input',
                  title: 'value',
                  'x-component-props': {
                    placeholder: '请输入环境变量值',
                  },
                  'x-mega-props': {
                    labelAlign: 'left',
                  },
                },
              },
            },
            'x-index': 1,
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
            'x-index': 2,
          },
        },
      },
    },
  };
  const form = useForm({
    onSubmit: (formData) => {
      const _env: Record<string, string> = {};
      (formData.env || [])
        .filter((envItem: {envName: string, envValue: string}) => !!envItem.envName)
        .forEach((envItem: {envName: string, envValue: string}) => {
          const { envName, envValue } = envItem;
          if (envValue) {
            _env[envName] = envValue;
          }
        });
      store.buildFunc({ ...formData, env: _env });
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
      className="build-func"
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
        components={{ AntdSelect, Input, TextArea: Input.TextArea, EnvList }}
      />
    </Modal>
  );
}

export default BuildModal;
