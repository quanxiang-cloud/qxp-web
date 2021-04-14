import React from 'react';
import { FormItem } from '@formily/antd';
import { Input, Select, Switch } from '@formily/antd-components';
import { createTooltipLabel } from '../../utils';

const AttrForm = () => {
  const pickerMode = [
    {
      label: '默认',
      value: '',
    },
    {
      label: '选择周',
      value: 'week',
    },
    {
      label: '选择月',
      value: 'month',
    },
    {
      label: '选择季度',
      value: 'quarter',
    },
    {
      label: '选择年',
      value: 'year',
    },
  ];

  return (
    <>
      <FormItem label="占位提示" name="placeholder" component={Input} />
      <FormItem
        type="string"
        label="选择类型"
        placeholder="选择周、月、季度、年等"
        name="picker"
        component={Select}
        options={pickerMode}
      />
      <FormItem
        type="string"
        label={createTooltipLabel(
          '默认值',
          '格式需对应类型如：默认 2021-03-01 | 周 2021-18th | 月 2021-03 | 季度 2021-Q2 | 年 2021。日期范围需用,号隔开',
        )}
        placeholder="如: 2020-01-23"
        name="initialValue"
        component={Input}
      />
      <FormItem label="范围选择" name="rangePicker" component={Switch} />
      <FormItem label="显示时间" name="showTime" component={Switch} />
      <FormItem label="显示清除" name="allowClear" component={Switch} />
    </>
  );
};

export default AttrForm;
