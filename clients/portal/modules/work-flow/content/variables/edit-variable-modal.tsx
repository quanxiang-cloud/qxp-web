import React from 'react';
import { useMutation } from 'react-query';

import { createFormActions, IFieldState, SchemaForm, FormEffectHooks, useForm } from '@formily/antd';
import { Select, Input, NumberPicker, DatePicker, Radio } from '@formily/antd-components';
import Modal from '@c/modal';
import toast from '@lib/toast';
import { saveFlowVariable } from '@flow/api';

import { FLOW_VARIABLE_FIELD_TYPES } from '../editor/utils/constants';

const FIELD_FORM_SCHEMA = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          title: '变量名称',
          required: true,
          maxLength: 20,
          'x-rules': [
            {
              required: true,
              message: '请输入名称',
            },
            {
              message: '不能以空白字符开头',
              pattern: /^\S/,
            },
          ],
          'x-component': 'Input',
          'x-index': 0,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        fieldType: {
          type: 'string',
          title: '变量类型',
          required: true,
          enum: FLOW_VARIABLE_FIELD_TYPES,
          'x-component': 'Select',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        defaultValue: {
          type: 'string',
          title: '默认值',
          'x-component': 'Input',
          'x-index': 2,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

interface Props {
  variable: ProcessVariable;
  closeModal(): void;
  onAdded(): void;
}

const actions = createFormActions();
const { onFieldValueChange$ } = FormEffectHooks;

export default function EditVariableModal({ variable, closeModal, onAdded }: Props): JSX.Element {
  const titleText = `${variable.id ? '修改' : '添加'}`;
  const staffMutation = useMutation(
    (values: Omit<ProcessVariable, 'desc' | 'code'>) => saveFlowVariable(values),
    {
      onSuccess: () => {
        toast.success('操作成功');
        onAdded();
      },
      onError: (error: string) => {
        toast.error(error);
      },
    });

  const form = useForm({
    actions,
    initialValues: variable,
    onSubmit: (formData) => {
      staffMutation.mutate({ flowId: variable.flowId, id: variable?.id || '', type: 'CUSTOM', ...formData });
    },
    effects: ($) => {
      const { setFieldState } = actions;

      onFieldValueChange$('fieldType').subscribe((fieldTypeState: IFieldState) => {
        const type = fieldTypeState.value;
        if (!type) return;
        const componentMap: Record<string, string> = {
          datetime: 'DatePicker',
          boolean: 'RadioGroup',
          number: 'NumberPicker',
          string: 'Input',
        };
        setFieldState('defaultValue', (state) => {
          state.props['x-component'] = componentMap[type];
          state.props.enum = undefined;
          if ( type === 'boolean') {
            state.props.enum = [
              { value: 'False', label: 'false' },
              { value: 'True', label: 'true' },
            ];
          }
          if (type === variable.fieldType) {
            state.value = variable.defaultValue;
            return;
          }
          state.value = '';
        });
      });
    },
  });

  function handleSubmit(): void {
    form.submit().then(() => {
      closeModal();
    }).catch(() => null);
  }

  return (
    <Modal
      title={`${titleText}变量`}
      onClose={closeModal}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: `确定${titleText}`,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <SchemaForm
        className="p-20"
        components={{ Input, Select, DatePicker, RadioGroup: Radio.Group, NumberPicker }}
        actions={actions}
        onSubmit={handleSubmit}
        schema={FIELD_FORM_SCHEMA}
        form={form as any}
      />
    </Modal>
  );
}
