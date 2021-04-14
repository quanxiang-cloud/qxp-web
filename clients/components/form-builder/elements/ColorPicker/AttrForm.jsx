import React from 'react';
import { FormItem } from '@formily/antd';
import ColorPicker from './ColorPicker';

const AttrForm = () => {
  return <FormItem label="默认值" name="initialValue" component={ColorPicker} />;
};

export default AttrForm;
