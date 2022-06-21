import React, { ReactElement } from 'react';
import Tab from '@c/tab';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import type { DelayedData } from '@flow/content/editor/type';
import { SchemaForm, useForm, createFormActions } from '@formily/antd';
import { Input, Select, Switch, NumberPicker } from '@formily/antd-components';

interface Props {
  defaultValue: DelayedData;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

const FIELD_FORM_SCHEMA = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        timer: {
          type: 'string',
          title: '定时触发',
          required: true,
          'x-rules': [
            {
              required: true,
              message: '请输入cron表达式',
            },
            {
              pattern: /^((\*|\?|\d+((\/|\\-){0,1}(\d+))*)\s*){6}$/,
              message: '请输入合格的cron表达式',
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
const Delayed = ({ defaultValue, onSubmit, onCancel }: Props): ReactElement=>{
  const form = useForm({
    actions,
    onSubmit: (formData) => {
      onSubmit(formData);
    },
    initialValues: defaultValue,
  });

  function onSave(): void {
    form.submit();
  }

  return (
    <>
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '基础配置',
          content: (
            <SchemaForm
              form={form as any}
              components={{ Input, Select, Switch, NumberPicker }}
              schema={FIELD_FORM_SCHEMA}
            />
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
};
export default Delayed;
