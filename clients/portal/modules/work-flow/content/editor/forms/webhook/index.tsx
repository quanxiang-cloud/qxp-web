import React, { useRef, useMemo, useCallback } from 'react';

import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

import SchemaForm from '@c/schema-form';
import type { SchemaFormSchema } from '@c/schema-form/type';
import { Input, WebhookData, RequestConfig, SendConfig } from '@flow/content/editor/type';
import withDragResize from '@lib/hoc/with-drag-resize';

import TriggerWay from './trigger-way';
import API from './api';
import Inputs from './inputs';
import EditWay from './edit-way';
import ContentType from './content-type';
import Outputs from './outputs';
import SendMethod from './send-method';
import { isUrl, inputValidator, requestApiValidator } from './utils';
import useDrawerContainerPadding from './hooks/use-drawer-container-padding';

import './style.scss';

type LocalValue = (RequestConfig | SendConfig) & { type: 'request' | 'send'} ;

enum FieldType {
  fieldType='fieldType',
  fieldName='fieldName',
  tableID='tableID',
}

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
      rules: {
        validate: requestApiValidator,
      },
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
          validate: (value: string) => {
            if (!value) {
              return '请输入Webhook URL';
            }
            return isUrl(value) ? true : '请输入合法的 URL';
          },
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
      name: 'method',
      watch: true,
      native: { type: 'hidden' },
      hide: (values: any) => values.type !== 'request',
      defaultValue: '',
    }, {
      title: '请求方法',
      name: 'sendMethod',
      watch: true,
      component: SendMethod,
      hide: (values: any) => values.type !== 'send',
      defaultValue: 'POST',
    }, {
      title: '编辑方式',
      name: 'editWay',
      watch: true,
      component: EditWay,
      defaultValue: 'multiple',
    }, {
      name: 'inputs',
      watch: true,
      component: Inputs,
      defaultValue: [],
      wrapperClassName: 'flex-1',
      rules: {
        validate: inputValidator,
      },
    }],
  }), []);

  const getType = ( val: string): string=>{
    const directExprArr = window.CONFIG.WebhookPathTreeValue;
    let directexprTypeArr: any = [];
    directExprArr.forEach((item: any)=>{
      const { name, data, descPath } = item;
      directexprTypeArr = [...directexprTypeArr, ...data.map((item: any)=>({
        name: `$${name}.${item.name}`,
        descPath,
      }))];
    });
    return directexprTypeArr.find((item: any)=>(val.includes(item.name) || val.includes(item.descPath))) ? 'direct_expr' : 'string';
  };

  const getField = (val: string, type: FieldType): string=>{
    let result = '';
    let list: any = [];
    const directExprArr = window.CONFIG.WebhookPathTreeValue;
    directExprArr.forEach((item: any)=>{
      const { name, data } = item;
      data.forEach((item: { value: string; name: any; })=>item.value = `$${name}.${item.name}`);
      list = [...list, ...data];
    });
    list.find((item: any)=>{
      if (val.includes(item.value)) {
        return result = item?.[type];
      }
    });
    return result;
  };

  const formatData = (val: { data: string; })=>{
    let list: any = [];
    const result = { ...val };
    const pathTreeValue = window.CONFIG.WebhookPathTreeValue;
    pathTreeValue.forEach((item: any)=>{
      const { name, data, desc } = item;
      data.forEach((item: { value: string; name: any; descPath: string; desc: any; })=>{
        item.value = `$${name}.${item.name}`;
        item.descPath = `${desc}.${item.desc}`;
      });
      list = [...list, ...data];
    });

    list.find((item: { descPath: any; value: any; })=>{
      if (result?.data?.includes(item?.descPath)) {
        result.data = result.data?.replace(item?.descPath, item?.value);
        return;
      }
    });
    return result;
  };
  const handleSubmit = useCallback(({ type, ...config }: LocalValue) => {
    try {
      if (type === 'request') {
        config.inputs = config.inputs?.map((item: any)=>({
          ...item,
          data: item?.data?.map((item: any)=>{
            const val = String(item.data)?.trim();
            return {
              ...formatData(item),
              type: getType(val),
              fieldType: item?.fieldType || getField(val, FieldType.fieldType),
              fieldName: item?.fieldName || getField(val, FieldType.fieldName),
              tableID: item?.tableID || getField(val, FieldType.tableID),
            };
          }),
        }));
      } else {
        config.inputs = config.inputs.map((item: any)=>{
          const val = String(item.data)?.trim();
          return {
            ...formatData(item),
            type: getType(val),
            fieldType: item?.fieldType || getField(val, FieldType.fieldType),
            fieldName: item?.fieldName || getField(val, FieldType.fieldName),
            tableID: item?.tableID || getField(val, FieldType.tableID),
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
    onSubmit({ type, config } as WebhookData);
  }, [onSubmit]);

  const handleChange = useCallback(({ type, ...config }) => {
    outputsRef.current = config.outputs;
    onChange({ type, config } as WebhookData);
  }, [onChange]);

  const shouldRePadding = useCallback(() => !!outputsRef.current?.length, [outputsRef.current?.length]);
  useDrawerContainerPadding(102, shouldRePadding);
  return (
    <>
      <SchemaForm<LocalValue>
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={handleChange}
        defaultValue={{ type: defaultValue.type, ...defaultValue.config }}
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
