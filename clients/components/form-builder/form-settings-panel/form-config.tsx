import React from 'react';
import { Radio, Switch, NumberPicker } from '@formily/antd-components';
import {
  Form, FormItem,
} from '@formily/antd';

import { createTooltipLabel } from '../utils';

const formLayout = [
  {
    label: '水平',
    value: 'horizontal',
  },
  {
    label: '垂直',
    value: 'vertical',
  },
  {
    label: '行内',
    value: 'inline',
  },
];
const labelAlign = [
  {
    label: '左对齐',
    value: 'left',
  },
  {
    label: '右对齐',
    value: 'right',
  },
];
const formSize = [
  {
    label: '较大',
    value: 'large',
  },
  {
    label: '中等',
    value: 'medium',
  },
  {
    label: '较小',
    value: 'small',
  },
];

export default function FormConfig(): JSX.Element {
  return (
    // <Form layout="vertical" onChange={setFormAttrs} value={formAttrs}>
    <Form layout="vertical">
      <FormItem
        name="size"
        label="表单尺寸"
        component={Radio.Group}
        options={formSize}
        initialValue="medium"
      />
      <FormItem
        name="layout"
        label="表单布局"
        component={Radio.Group}
        options={formLayout}
        initialValue="horizontal"
      />
      <FormItem
        name="labelAlign"
        label="标签对齐"
        component={Radio.Group}
        options={labelAlign}
        initialValue="right"
      />
      <FormItem name="helpInLabel" label="Tooltip 描述" component={Switch} initialValue />
      <FormItem
        type="string"
        label={createTooltipLabel('标签长度', '表单 label 所占得长度，和表单内容共分 24 栅格')}
        placeholder="请输入默认值"
        name="labelCol"
        component={NumberPicker}
        min={0}
        max={23}
      />
      <FormItem
        type="string"
        label={createTooltipLabel(
          '内容长度',
          '表单内容所占得长度，和表单标签 label 共分 24 栅格',
        )}
        placeholder="请输入默认值"
        name="wrapperCol"
        component={NumberPicker}
        min={0}
        max={23}
      />
    </Form>
  );
}
