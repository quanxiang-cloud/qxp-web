import React, { forwardRef } from 'react';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';

const { TextArea } = Input;

interface Props {
  msgApiKey: MsgApiKey,
}

function FormKeyMsg(props: Props, ref?: React.ForwardedRef<FormInstance>): JSX.Element {
  const { msgApiKey } = props;

  return (
    <Form ref={ref} layout='vertical'>
      <Form.Item
        name="title"
        label="名称"
        rules={[{ max: 50, message: '名称不能超过 50 字符' }]}
        initialValue={msgApiKey?.title}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
      <Form.Item
        name="description"
        label="描述"
        rules={[{ max: 100, message: '输入超过 100 字符' }]}
        initialValue={msgApiKey?.description}
      >
        <TextArea placeholder="选填(不超过 100 字符)"/>
      </Form.Item>
    </Form>
  );
}

export default forwardRef(FormKeyMsg);
