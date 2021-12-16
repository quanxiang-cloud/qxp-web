import React, { useRef } from 'react';

import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

import SchemaForm from '@c/schema-form';
import type { SchemaFormSchema } from '@c/schema-form/type';

import { WebhookData, RequestConfig, SendConfig } from '../../type';
import TriggerWay from './trigger-way';
import API from './api';

type LocalValue = (RequestConfig | SendConfig) & { type: 'request' | 'send' };

type Props = {
  onSubmit: (v: WebhookData) => void;
  onChange: (v: WebhookData) => void;
  onCancel: () => void;
  defaultValue: WebhookData;
}

export default function WebhookConfig(
  { onCancel, onSubmit, onChange, defaultValue }: Props,
): JSX.Element | null {
  const formRef = useRef<HTMLFormElement>(null);

  function onSave(): void {
    formRef.current?.submit();
  }

  const schema: SchemaFormSchema = {
    fields: [{
      title: '触发方式',
      name: 'type',
      watch: true,
      component: TriggerWay,
    }, {
      title: 'API',
      name: 'api',
      watch: true,
      component: API,
    }],
  };

  return (
    <>
      <SchemaForm<LocalValue>
        ref={formRef}
        onSubmit={({ type, ...config }) => onSubmit({ type: type, config } as WebhookData)}
        onChange={({ type, ...config }) => onChange({ type: type, config } as WebhookData)}
        defaultValue={{ type: defaultValue.type, ...defaultValue.config }}
        schema={schema}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
}
