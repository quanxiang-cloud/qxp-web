import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Radio } from '@formily/antd-components';

const listTypeOpts = [
  {
    label: '卡片',
    value: 'card',
  },
  {
    label: '拖拽',
    value: 'dragger',
  },
  {
    label: '普通',
    value: 'text',
  },
];

const AttrForm = () => {
  return (
    <>
      <FormItem
        type="string"
        label="上传地址"
        placeholder="上传地址"
        name="action"
        component={Input}
      />
      <FormItem
        type="string"
        label="文字位置"
        name="listType"
        component={Radio.Group}
        options={listTypeOpts}
        initialValue="text"
      />
    </>
  );
};

export default AttrForm;
