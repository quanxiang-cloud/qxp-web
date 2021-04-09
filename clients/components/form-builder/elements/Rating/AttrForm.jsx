import React from 'react';
import { FormItem } from '@formily/antd';
import { NumberPicker, Switch } from '@formily/antd-components';

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
        type="number"
        label="star 总数"
        placeholder="star 总数"
        name="count"
        component={NumberPicker}
      />
      <FormItem label="允许半选" name="allowHalf" component={Switch} />
    </>
  );
};

export default AttrForm;
