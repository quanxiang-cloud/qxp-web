import React, { KeyboardEvent, useCallback } from 'react';
import { toJS } from 'mobx';
import { Form, Input } from 'antd';

import toast from '@lib/toast';

import AppZipUpload from './app-zip-upload';
import AppIconPicker from './app-icon-picker';
import { fetchTemplateList, TemplateListRes } from '../../app-templates/api';
import AppLayoutType from '../layout-select';

import './style.scss';

export const DISABLE_SPECIAL_SYMBOL_REG = /[#$@^&=`'":;,.~¥-。、（）「」·“”；：？，《》【】+/\\()<>{}[\] ]/gi;

type Props = {
  modalType: string;
  className?: string;
  appInfo?: AppInfo;
  onSubmitCallback?: () => void;
  onValuesChange?: (value: any) => void;
}

async function getTemplateOptions(): Promise<LabelValue[]> {
  let options: LabelValue[] = [];
  await fetchTemplateList().then(({ templates }: TemplateListRes) => {
    options = templates.map(({ name, id }: any) => {
      return { label: name, value: id };
    });
  }).catch(() => toast.error('获取模版列表失败'));

  return options;
}

function CreatedEditApp({
  appInfo, modalType, className, onSubmitCallback, onValuesChange,
}: Props, ref?: any): JSX.Element {
  const [form] = Form.useForm();
  const initData = appInfo && toJS(appInfo);
  const { appName, appIcon = '{}', appSign } = initData || {};

  const handleEnterSubmit = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && handleFinish();
  }, []);

  function handleFinish(): void {
    onSubmitCallback && onSubmitCallback();
  }

  function handleValuesChange(value: Record<string, unknown>): void {
    // has('createdBy', value) && setCreatedBy(value.createdBy as string);
    onValuesChange?.(value);
  }

  return (
    <Form
      layout="vertical"
      className={className}
      form={form}
      ref={ref}
      initialValues={{
        appName,
        appSign,
        appIcon,
        layoutType: 'free',
      }}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        name='appName'
        label='应用名称:'
        extra='不超过 30 个字符，应用名称不可重复。'
        rules={[
          {
            required: true,
            message: '请输入应用名称',
          },
          {
            pattern: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
            message: '不能输入emoji表情符号',
          },
          {
            type: 'string',
            max: 30,
            message: '不能超过 30 个字符',
          },
          {
            validator: (rule, value) => {
              if (!value) {
                return Promise.resolve();
              } else if (DISABLE_SPECIAL_SYMBOL_REG.test(value)) {
                return Promise.reject(new Error('不能包含特殊字符'));
              } else {
                return Promise.resolve();
              }
            },
          },
        ]}
      >
        <Input placeholder="请输入应用名称" />
      </Form.Item>
      <Form.Item
        name='appSign'
        label='应用标识'
        tooltip='应用标识用于标记开发者账号，即用户 id，便于在二次开发中使用'
        extra='必须以字母开头,由字母、数字组成'
        rules={[
          {
            required: true,
            message: '请输入应用标识',
          },
          {
            type: 'string',
            max: 20,
            message: '不能超过 20 个字符',
          },
          {
            pattern: /^[a-z][a-z0-9]*$/,
            message: '必须以小写字母开头,由小写字母、数字组成',
          },
        ]}
      >
        <Input placeholder="请输入应用标识" disabled={!!appSign} onKeyUp={handleEnterSubmit} />
      </Form.Item>
      <Form.Item
        name="appIcon"
        label="应用图标:"
        rules={[
          {
            required: true,
            message: '请选择应用图标',
          },
        ]}
      >
        <AppIconPicker />
      </Form.Item>
      <Form.Item
        name="layoutType"
        label="应用导航"
        tooltip='应用导航可将多张页面链接起来，使其可以方便地访问到所需的内容'
        hidden={['importApp', 'createAppWithTemplate', 'editApp'].includes(modalType)}
      >
        <AppLayoutType includeFree />
      </Form.Item>

      {modalType === 'importApp' && (
        <Form.Item
          required
          name="appZipInfo"
          label="上传应用"
        >
          <AppZipUpload />
        </Form.Item>
      )}
    </Form>
  );
}

export default React.forwardRef(CreatedEditApp);
