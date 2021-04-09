import React from 'react';
import { FormItem } from '@formily/antd';
import { NumberPicker } from '@formily/antd-components';

const AttrForm = () => {
  return (
    <>
      <FormItem
        type="string"
        label="默认值"
        placeholder="请输入默认值"
        name="initialValue"
        component={NumberPicker}
      />
      <FormItem
        type="string"
        label="步长"
        placeholder="步长"
        name="step"
        component={NumberPicker}
      />
      <FormItem
        type="string"
        label="最小值"
        placeholder="最小值"
        name="min"
        component={NumberPicker}
      />
      <FormItem
        type="string"
        label="最大值"
        placeholder="最大值"
        name="max"
        component={NumberPicker}
      />
    </>
  );
};

export default AttrForm;
