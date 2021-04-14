import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Radio, Switch, Range, NumberPicker } from '@formily/antd-components';
import { createTooltipLabel } from '../../utils';

const labelAlign = [
  {
    label: '左侧',
    value: 'left',
  },
  {
    label: '右侧',
    value: 'right',
  },
  {
    label: '顶部',
    value: 'top',
  },
];

const layoutMode = [
  {
    label: '默认',
    value: 'default',
  },
  {
    label: '行内',
    value: 'inline',
  },
  {
    label: '栅格',
    value: 'grid',
  },
];

const AttrForm = () => {
  const labelColLabel = createTooltipLabel('标签宽度', '24 列栅格布局, 标签和表单按照比例分配宽度');
  return (
    <>
      <FormItem type="string" label="字段 key" required name="name" component={Input} />
      <FormItem
        name="labelAlign"
        label="标签对齐"
        initialValue="right"
        component={Radio.Group}
        options={labelAlign}
      />
      <FormItem label="表格撑满" name="full" component={Switch} />
      <FormItem label={labelColLabel} name="labelCol" min={0} max={24} component={Range} />
      <FormItem
        name="layoutMode"
        label="布局方式"
        initialValue="default"
        component={Radio.Group}
        options={layoutMode}
      />
      <FormItem
        label={createTooltipLabel('列数', '栅格布局列数')}
        name="columns"
        component={NumberPicker}
        min={2}
        initialValue={3}
      />
    </>
  );
};

export default AttrForm;
