import React, { KeyboardEvent, useCallback } from 'react';
import { toJS } from 'mobx';
import { Form, Input } from 'antd';

import AppZipUpload from './app-zip-upload';
import AppIconPicker from './app-icon-picker';

import './style.scss';

const DISABLE_SPECIAL_SYMBOL_REG = /[#$@^&=`'":;,.~¥-。、（）「」·“”；：？，《》【】+/\\()<>{}[\] ]/gi;

type Props = {
  className?: string;
  appInfo?: AppInfo;
  modalType: string;
  onSubmitCallback?: () => void;
  onValuesChange?: () => void;
}

function CreatedEditApp({
  appInfo, modalType, className, onSubmitCallback, onValuesChange,
}: Props, ref?: any): JSX.Element {
  const [form] = Form.useForm();

  function handleFinish(): void {
    onSubmitCallback && onSubmitCallback();
  }

  const initData = appInfo && toJS(appInfo);
  const { appName, appIcon = '{}', appSign } = initData || {};

  const handleEnterSubmit = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && handleFinish();
  }, []);

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
      }}
      onFinish={handleFinish}
      onValuesChange={onValuesChange}
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
        label='应用标志:'
        // extra='必须以字母开头,由字母、数字、单下划线组成'
        extra='必须以字母开头,由字母、数字组成'
        rules={[
          {
            required: true,
            message: '请输入应用标识',
          },
          {
            type: 'string',
            max: 30,
            message: '不能超过 30 个字符',
          },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
            message: '必须以字母开头,由字母、数字组成',
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
