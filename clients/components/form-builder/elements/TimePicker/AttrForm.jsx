import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Switch } from '@formily/antd-components';

const AttrForm = () => {
  return (
    <>
      <FormItem label="占位提示" name="placeholder" component={Input} />
      <FormItem
        type="string"
        label="默认值"
        placeholder="如: 10:29"
        name="initialValue"
        component={Input}
      />
      <FormItem label="范围选择" name="rangePicker" component={Switch} />
      <FormItem label="12 小时制" name="use12Hours" component={Switch} />
      <FormItem label="显示清除" name="allowClear" component={Switch} />
    </>
  );
};

export default AttrForm;
