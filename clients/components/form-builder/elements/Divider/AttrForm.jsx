import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Switch, Radio } from '@formily/antd-components';

const AttrForm = () => {
  const orientation = [
    {
      label: '居左',
      value: 'left',
    },
    {
      label: '居中',
      value: 'center',
    },
    {
      label: '居右',
      value: 'right',
    },
  ];

  return (
    <>
      <FormItem type="string" label="字段 key" required name="name" component={Input} />
      <FormItem label="文字" name="text" component={Input} />
      <FormItem
        type="string"
        label="文字位置"
        name="orientation"
        component={Radio.Group}
        options={orientation}
        initialValue="center"
      />
      <FormItem label="文字加粗" name="plain" component={Switch} />
      <FormItem label="虚线" name="dashed" component={Switch} />
      <FormItem type="string" label="CSS 类名" name="className" component={Input} />
    </>
  );
};

export default AttrForm;
