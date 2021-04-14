import React from 'react';
import { FormItem } from '@formily/antd';
import { Input } from '@formily/antd-components';

const AttrForm = () => {
  return (
    <>
      <FormItem label="占位提示" name="placeholder" component={Input} />
      <FormItem
        type="string"
        label="默认值"
        placeholder="请输入默认值"
        name="initialValue"
        component={Input}
      />
      <FormItem
        type="string"
        label="前缀"
        placeholder="请输入前缀"
        name="addonBefore"
        component={Input}
      />
      <FormItem
        type="string"
        label="前图标"
        placeholder="请输入后缀"
        name="prefix"
        component={Input}
      />
    </>
  );
};

export default AttrForm;
