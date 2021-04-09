import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Switch, Select } from '@formily/antd-components';

const AttrForm = () => {
  const alertType = [
    {
      label: '消息',
      value: 'info',
    },
    {
      label: '成功',
      value: 'success',
    },
    {
      label: '警告',
      value: 'warning',
    },
    {
      label: '错误',
      value: 'error',
    },
  ];

  return (
    <>
      <FormItem label="标题" name="message" component={Input} />
      <FormItem
        type="string"
        label="描述"
        placeholder="请输入描述信息"
        name="description"
        component={Input.TextArea}
      />
      <FormItem type="string" label="选择类型" name="type" component={Select} options={alertType} />
      <FormItem label="允许关闭" name="closable" component={Switch} />
      <FormItem type="string" label="图标" name="icon" component={Input} />
    </>
  );
};

export default AttrForm;
