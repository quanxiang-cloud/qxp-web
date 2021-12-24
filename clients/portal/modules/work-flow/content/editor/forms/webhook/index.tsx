import React, { useRef, useMemo, useCallback } from 'react';
import { omit } from 'ramda';

import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

import SchemaForm from '@c/schema-form';
import type { SchemaFormSchema } from '@c/schema-form/type';
import { Input, WebhookData, RequestConfig, SendConfig } from '@flow/content/editor/type';
import withDragResize from '@lib/hoc/with-drag-resize';

import TriggerWay from './trigger-way';
import API from './api';
import Inputs from './inputs';
import ContentType from './content-type';
import Outputs from './outputs';

import './style.scss';

type LocalValue = (RequestConfig | Omit<SendConfig, 'url'> & { sendUrl: string }) &
{ type: 'request' | 'send' };

type Props = {
  onSubmit: (v: WebhookData) => void;
  onChange: (v: WebhookData) => void;
  onCancel: () => void;
  defaultValue: WebhookData;
}

const ResizableOutputs = withDragResize(Outputs, {
  position: 'top',
  minHeight: 38,
  className: 'absolute left-0 right-0 bottom-64 px-20 transition-all duration-240 bg-white border-t-1 z-10',
  style: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    maxHeight: '93%',
  },
});

export default function WebhookConfig(
  { onCancel, onSubmit, onChange, defaultValue }: Props,
): JSX.Element | null {
  const formRef = useRef<HTMLFormElement>(null);
  const outputsRef = useRef<Input[]>(defaultValue.config.outputs ?? []);

  function onSave(): void {
    formRef.current?.submit();
  }

  const schema: SchemaFormSchema = useMemo(() => ({
    fields: [{
      title: '触发方式',
      name: 'type',
      watch: true,
      component: TriggerWay,
      defaultValue: 'request',
    }, {
      name: 'api',
      watch: true,
      component: API,
      hide: (values: any) => values.type !== 'request',
      defaultValue: { value: '' },
    }, {
      name: 'url',
      watch: true,
      native: { type: 'hidden', options: { required: true } },
      hide: (values: any) => values.type !== 'request',
      defaultValue: '',
    }, {
      title: 'Webhook URL',
      name: 'sendUrl',
      watch: true,
      native: {
        type: 'textarea',
        options: {
          required: true,
        },
      },
      hide: (values: any) => values.type !== 'send',
      defaultValue: '',
    }, {
      name: 'outputs',
      watch: true,
      native: { type: 'hidden' },
      hide: (values: any) => values.type !== 'request',
      defaultValue: [],
    }, {
      name: 'contentType',
      watch: true,
      component: ContentType,
      hide: (values: any) => values.type !== 'send',
      defaultValue: 'application/json',
    }, {
      name: 'inputs',
      watch: true,
      component: Inputs,
      defaultValue: [],
      wrapperClassName: 'flex-1',
    }],
  }), []);

  const handleSubmit = useCallback(({ type, ...config }) => {
    onSubmit({ type: type, config } as WebhookData);
  }, []);

  const handleChange = useCallback(({ type, ...config }) => {
    outputsRef.current = config.outputs;
    onChange({
      type: type,
      config: type === 'request' ? config : { ...omit(['sendUrl'], config), url: config.sendUrl },
    } as WebhookData);
  }, []);

  const config = defaultValue.type === 'request' ? defaultValue.config : {
    ...omit(['url'], defaultValue.config),
    sendUrl: defaultValue.config.url,
  };

  return (
    <>
      <SchemaForm<LocalValue>
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={handleChange}
        defaultValue={{ type: defaultValue.type, ...config }}
        schema={schema}
        className="h-full flex flex-col"
      />
      {!!outputsRef.current?.length && (
        <ResizableOutputs value={outputsRef.current} />
      )}
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
}
