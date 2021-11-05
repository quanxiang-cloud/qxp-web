import React, { forwardRef } from 'react';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';

const { TextArea } = Input;
type MsgApiKey = {
  keyID: string,
  keySecret: string,
  description: string,
}
interface Props {
  msgApiKey: MsgApiKey,
  isEditor: boolean,
}

function CreatApiKeyTable(props: Props, ref?: React.ForwardedRef<FormInstance>): JSX.Element {
  const { msgApiKey, isEditor } = props;

  return (
    <Form ref={ref} layout='vertical'>
      <Form.Item
        name="keyID"
        label="密钥ID"
        rules={[{
          max: 50,
          message: '名称不能超过 50 字符',
        }, {
          required: !isEditor,
          message: '请输入密钥ID',
        }]}
        initialValue={msgApiKey?.keyID}
      >
        <Input placeholder="请输入" disabled={isEditor}/>
      </Form.Item>
      {!isEditor && (
        <Form.Item
          name="keySecret"
          label="密钥Secret"
          rules={[{
            max: 50,
            message: '名称不能超过 50 字符',
          }, {
            required: true,
            message: '请输入密钥ID',
          }]}
          initialValue={msgApiKey?.keySecret}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
      )}
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

export default forwardRef(CreatApiKeyTable);
