import React from 'react';

import Modal, { FooterBtnProps } from '@c/modal';
import SchemaForm, { createFormActions, Field, useForm } from '@formily/antd';
import { Input } from '@formily/antd-components';

interface Props {
  onSubmit: () => void
  onCancel: () => void;
}

export default function SetTimeTaskModal({
  onSubmit,
  onCancel,
}: Props): JSX.Element {
  const actions = createFormActions();
  const btnList: FooterBtnProps[] = [
    {
      text: '取消',
      key: 'cancel',
      iconName: 'close',
      onClick: onCancel,
    },
    {
      text: '确认',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: () => form.submit(),
    },
  ];
  const COMPONENTS = {
    Input,
  };

  const form = useForm({
    actions,
    onSubmit: (formData) => onSubmit(),
  });

  return (
    <Modal
      title='设置定时'
      onClose={onCancel}
      footerBtns={btnList}
    >
      <div className="p-20">
        <SchemaForm
          form={form as any}
          components={COMPONENTS}
          // defaultValue={defaultValue}
        >
          <Field name="timer" type="string" title="时间" x-component="Input" />
        </SchemaForm>
      </div>

    </Modal>
  );
}
