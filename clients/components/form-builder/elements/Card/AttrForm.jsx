import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Radio } from '@formily/antd-components';

const AttrForm = () => {
  const sizeOptions = [
    {
      label: '默认',
      value: 'small',
    },
    {
      label: '较大',
      value: 'default',
    },
  ];

  return (
    <>
      <FormItem type="string" label="标题" name="title" component={Input} />
      <FormItem type="string" label="字段 key" required name="name" component={Input} />
      <FormItem label="尺寸" name="size" component={Radio.Group} options={sizeOptions} />
      <FormItem type="string" label="CSS 类名" name="className" component={Input} />
    </>
  );
};

export default AttrForm;
