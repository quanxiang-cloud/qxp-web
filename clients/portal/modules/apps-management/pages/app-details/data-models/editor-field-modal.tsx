import React from 'react';
import { SchemaForm, useForm, FormEffectHooks, createFormActions } from '@formily/antd';
import { Input, Select, Switch, NumberPicker } from '@formily/antd-components';

import Modal from '@c/modal';

import { FIELD_SCHEMA } from './form-schema';

const { onFieldValueChange$ } = FormEffectHooks;

type Props = {
  isEditor: boolean;
  onCancel: () => void;
  onSubmit: (value: ModelField) => void;
  field?: ModelField;
}

const PATH: Record<string, string> = {
  string: '*(length, validationRules)',
  datetime: 'format',
  number: '*(length, digits)',
  array: 'subtype',
};

function EditorDataModelModal({ isEditor = false, onCancel, onSubmit, field }: Props): JSX.Element {
  const form = useForm({
    onSubmit,
    initialValues: field,
    effects: () => {
      const { setFieldState } = createFormActions();
      onFieldValueChange$('type').subscribe(({ value }) => {
        setFieldState('*(length, validationRules, digits, format, subtype, regular)', (state) => {
          state.visible = false;
        });

        setFieldState(PATH[value] || '', (state) => {
          state.visible = true;
        });
      });

      onFieldValueChange$('validationRules').subscribe(({ value }) => {
        setFieldState('regular', (state) => {
          state.visible = value === 'custom';
        });
      });
    },
  });

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <Modal
      title={`${isEditor ? '编辑' : '新建'}数据字段`}
      onClose={onCancel}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: '保存',
          key: 'next',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <div className='p-20'>
        <SchemaForm
          form={form as any}
          components={{ Input, Select, Switch, NumberPicker }}
          schema={FIELD_SCHEMA}
        />
      </div>
    </Modal>
  );
}

export default EditorDataModelModal;
