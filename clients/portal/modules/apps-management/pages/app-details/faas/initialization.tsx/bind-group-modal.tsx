import React from 'react';
import SchemaForm, { useForm, FormEffectHooks, createFormActions } from '@formily/antd';
import { Radio, Input, Select as AntdSelect } from '@formily/antd-components';

import Modal from '@c/modal';
import Icon from '@c/icon';

import store from '../store';

const SCHEMA = {
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
              label: '新增',
              value: 'custom',
            },
            {
              label: '关联已有Group',
              value: 'association',
            },
          ],
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        gid: {
          type: 'number',
          title: '选择Group',
          required: true,
          'x-component-props': {
            placeholder: '请选择',
          },
          'x-rules': [
            {
              required: true,
              message: '选择Group',
            },
          ],
          'x-component': 'AntdSelect',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
          enum: [
            { label: 'some', value: 'currentFormValue' },
            { label: 'one', value: 'fixedValue' },
          ],
        },
        name: {
          type: 'string',
          title: 'Group',
          required: true,
          'x-component-props': {
            placeholder: '请输入名称',
          },
          'x-rules': [
            {
              required: true,
              message: '请输入名称',
            },
          ],
          'x-component': 'Input',
          'x-index': 2,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        describe: {
          type: 'string',
          title: '描述',
          'x-component-props': {
            placeholder: '选填（不超过100字符）',
          },
          'x-rules': {
            max: 100,
            message: '超过 100 字符!',
          },
          'x-component': 'TextArea',
          'x-index': 3,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

const { onFieldValueChange$ } = FormEffectHooks;
const actions = createFormActions();

function BindGroupModal(): JSX.Element {
  const form = useForm({
    actions,
    onSubmit: (formData) => store.onSubmitGroupModal(formData),
    effects: ($) => {
      const { setFieldState } = actions;
      onFieldValueChange$('type').subscribe(({ value }) => {
        setFieldState('gid', (state) => {
          state.visible = value === 'association';
          state.props.enum = store.optionalGroupToSelectEnum;
        });
        setFieldState('name', (state) => {
          state.visible = value === 'custom';
        });
        setFieldState('describe', (state) => {
          state.visible = value === 'custom';
        });
      });
    },
  });

  return (
    <Modal
      title="创建 / 绑定空间"
      onClose={() => store.setShowBindGroupModal(false)}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          onClick: () => store.setShowBindGroupModal(false),
        },
        {
          text: '确定',
          key: 'confirm',
          modifier: 'primary',
          onClick: () => form.submit(),
        },
      ]}
    >
      <div
        className='rounded-12 rounded-tl-4 flex items-center bg-blue-100 text-blue-600 py-10 px-16 mt-16 mx-16'
      >
        <Icon name='info' size={14} />
        <span className='ml-10 text-12'>
          Group配置属于基础设置，该应用若绑定Group空间后，暂时不能进行修改，请谨慎操作！
        </span>
      </div>
      <SchemaForm
        className="py-24 px-20"
        schema={SCHEMA}
        form={form as any}
        components={{ Input, TextArea: Input.TextArea, RadioGroup: Radio.Group, AntdSelect }}
      />
    </Modal>
  );
}

export default BindGroupModal;
