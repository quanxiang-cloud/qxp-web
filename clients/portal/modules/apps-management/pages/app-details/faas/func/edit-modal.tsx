import React from 'react';
import SchemaForm, { createFormActions, FormEffectHooks, useForm } from '@formily/antd';
import { Input, Radio, Select as AntdSelect } from '@formily/antd-components';

import store from './store';
import Modal from '@c/modal';

type Props = {
  modalType: string;
  onClose: () => void;
}

const { onFieldValueChange$ } = FormEffectHooks;
const actions = createFormActions();

const SCHEMA: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        type: {
          type: 'string',
          title: '来源',
          'x-component': 'RadioGroup',
          required: true,
          default: 'custom',
          enum: [
            {
              label: '新建',
              value: 'custom',
            },
            {
              label: '关联已有Project',
              value: 'association',
            },
          ],
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        id: {
          type: 'number',
          title: '选择Project',
          required: true,
          'x-component-props': {
            placeholder: '请选择',
          },
          'x-rules': [
            {
              required: true,
              message: '选择Project',
            },
          ],
          'x-component': 'AntdSelect',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        alias: {
          type: 'string',
          title: '函数名称',
          // description: '最多 20 个字符，支持中文、英文、下划线、数字。函数名称不可重复',
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
              max: 20,
              message: '名称不超过 20 字符，请修改！',
            },
            {
              pattern: /^[^\s]*$/,
              message: '请勿包含空格',
            },
          ],
          'x-index': 2,
        },
        name: {
          type: 'string',
          title: '函数标识',
          required: true,
          // description: '最多 20 字符，必须以字母开头，只能包含字母、数字、下划线，标识不可重复。',
          'x-component-props': {
            placeholder: '请输入，例如：sys001',
          },
          'x-rules': [
            {
              required: true,
              message: '请输入函数标识',
            },
            {
              max: 20,
              message: '函数标识不超过 20 字符，请修改！',
            },
            {
              pattern: /^[a-z]+([0-9])*$/,
              message: '必须以小写字母开头,由小写字母、数字组成',
            },
          ],
          'x-component': 'Input',
          'x-index': 3,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        language: {
          type: 'string',
          title: '语言',
          ['x-component']: 'RadioGroup',
          default: 'go',
          // readOnly: true,
          enum: [{
            label: 'GO语言',
            value: 'go',
          }],
          'x-rules': [
            {
              required: true,
              message: '请输入函数标识',
            },
          ],
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        init: {
          type: 'string',
          title: '是否初始化Project',
          'x-component': 'RadioGroup',
          required: true,
          default: true,
          enum: [
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false,
            },
          ],
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
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
          'x-index': 6,
        },
      },
    },
  },
};

function EditModal({ modalType, onClose }: Props): JSX.Element {
  const form = useForm({
    actions,
    onSubmit: (formData) => {
      store.createFunc(formData);
    },
    effects: ($) => {
      const { setFieldState } = actions;
      onFieldValueChange$('type').subscribe(({ value }) => {
        setFieldState('id', (state) => {
          state.visible = value === 'association';
          state.props.enum = store.optionalProjectToSelectEnum;
        });
        setFieldState('name', (state) => {
          state.editable = value === 'custom';
        });
        setFieldState('init', (state) => {
          state.visible = value === 'custom';
        });
      });
      onFieldValueChange$('id').subscribe(({ values }) => {
        setFieldState('name', (state) => {
          state.value = values[1].title;
        });
      });
    },
  });

  function handleSubmit(): void {
    form.submit().then(() => {
      store.setModalType('');
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
          onClick: () => store.setModalType(''),
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
        components={{ Input, TextArea: Input.TextArea, RadioGroup: Radio.Group, AntdSelect }}
      />
    </Modal>
  );
}

export default EditModal;
