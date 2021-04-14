import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Switch, Radio } from '@formily/antd-components';

const AttrForm = () => {
  return (
    <>
      <FormItem label="默认值" name="initialValue" component={Switch} />
      <FormItem
        type="string"
        label="开启提示"
        name="checkedChildren"
        placeholder="开启时提示文字"
        component={Input}
      />
      <FormItem
        type="string"
        label="关闭提示"
        name="unCheckedChildren"
        placeholder="关闭时提示文字"
        component={Input}
      />
      <FormItem
        label="大小"
        name="size"
        component={Radio.Group}
        options={[
          {
            label: '默认',
            value: 'default',
          },
          {
            label: '较小',
            value: 'small',
          },
        ]}
      />
    </>
  );
};

export default AttrForm;
