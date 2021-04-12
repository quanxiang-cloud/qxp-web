import React from 'react';
import { Toggle } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Select from '@c/select';
import Checkbox from '@c/checkbox';

import FilterSetting from './filter-setting';
import FieldSort from './field-sort';

const SORT_OPTION = [
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_down' />
      按新建时间最新的在前
      </div>
    ),
    value: '1',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_up' />
      按新建时间最旧的在前
      </div>
    ),
    value: '2',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_down' />
      按修改时间最新的在前
      </div>
    ),
    value: '3',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_up' />
      按修改时间最旧的在前
      </div>
    ),
    value: '4',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='mediation' />
      自定义排序规则
      </div>
    ),
    value: '5',
  },
];

const PAGE_SIZE_OPTION = [
  { label: '10条/页', value: 10 },
  { label: '20条/页', value: 20 },
  { label: '30条/页', value: 30 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 },
  { label: '200条/页', value: 200 },
];

function PageSettingConfig() {
  const configItemRender = (title: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className='mt-24'>
        <div className='mb-8 text-body2'>{title}</div>
        <div>{content}</div>
      </div>
    );
  };

  return (
    <div className='page-setting-option'>
      <p className='text-caption-no-color text-gray-400'>选择配置以下内容以定义页面视图的显示元素。</p>
      {configItemRender('筛选条件', <FilterSetting />)}
      {configItemRender('排序规则', <Select options={SORT_OPTION} />)}
      {configItemRender(
        <div className='flex items-center justify-between'>
          <span>分页</span><Toggle onText='开启' offText='关闭' />
        </div>,
        <Select options={PAGE_SIZE_OPTION} />
      )}
      {configItemRender(
        <div className='flex items-center justify-between'>
          <span>字段显示和排序</span><span><Checkbox label='全选' /></span>
        </div>,
        <FieldSort />
      )}
    </div>
  );
}

export default PageSettingConfig;
