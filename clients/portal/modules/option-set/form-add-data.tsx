import React, { forwardRef, useImperativeHandle } from 'react';
import cs from 'classnames';
import { Form, Input } from 'antd';

import Checkbox from './checkbox';

import './index.scss';

const { TextArea } = Input;

interface Props {
  className?: string;
  editInfo?: Pick<OptionSet, 'name' | 'tag'>;
  canExpand?: boolean;
  onCallback?: () => void;
}

export type FormAddDataRef = {
  getValues: () => any;
  submit: () => void;
};

function FormAddData({
  editInfo, className, canExpand = false, onCallback,
}: Props, ref: any): JSX.Element {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      getValues: () => form.getFieldsValue(),
      submit: () => form.submit(),
    };
  });

  function handleFinish(): void {
    onCallback && onCallback();
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className={cs('form-add-dataset text-blueGray-400', className)}
        onFinish={handleFinish}
        initialValues={{
          option_set_name: editInfo?.name,
          option_set_tag: editInfo?.tag,
        }}
      >
        <Form.Item
          name="option_set_name"
          label="选项集名称1"
          rules={[
            {
              required: true,
              message: '请输入选项集名称',
            }, {
              type: 'string',
              max: 15,
              message: '输入超过 15 个字',
            },
          ]}
        >
          <Input placeholder="选项集名称" />
        </Form.Item>
        <Form.Item
          name="option_set_tag"
          label="描述"
          rules={[
            {
              type: 'string',
              max: 100,
              message: '输入超过 100 个字',
            },
          ]}
        >
          <TextArea placeholder="选填(不超过 100 字符)" />
        </Form.Item>
        {
          canExpand && (
            <Form.Item name="option_set_expand" className="flex absolute mt-40 w-316">
              <Checkbox />
            </Form.Item>
          )
        }
      </Form>
    </>
  );
}

export default forwardRef<FormAddDataRef, Props>(FormAddData);
