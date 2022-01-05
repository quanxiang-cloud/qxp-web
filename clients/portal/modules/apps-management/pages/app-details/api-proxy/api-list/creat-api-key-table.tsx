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
          required: !isEditor,
          message: '请输入密钥ID',
        }, {
          max: 512,
          message: '输入不能超过 512 字符',
        }]}
        initialValue={msgApiKey?.keyID}
      >
        <TextArea placeholder="请输入" disabled={isEditor} rows={1} autoSize={{ minRows: 1, maxRows: 3 }}/>
      </Form.Item>
      {!isEditor && (
        <Form.Item
          name="keySecret"
          label="密钥Secret"
          rules={[{ required: true, message: '请输入密钥Secret' }]}
          initialValue={msgApiKey?.keySecret}
        >
          <TextArea placeholder="请输入" rows={1} autoSize={{ minRows: 1, maxRows: 3 }}/>
        </Form.Item>
      )}
      <Form.Item
        name="description"
        label="描述"
        rules={[{ max: 100, message: '输入不能超过 100 字符' }]}
        initialValue={msgApiKey?.description}
      >
        <TextArea placeholder="选填(不超过 100 字符)"/>
      </Form.Item>
    </Form>
  );
}

export default forwardRef(CreatApiKeyTable);
