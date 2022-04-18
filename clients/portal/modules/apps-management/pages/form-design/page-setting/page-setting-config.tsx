import React, { ReactChild } from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Select from '@c/select';
import Checkbox from '@c/checkbox';

import FilterSetting from './filter-setting';
import TableColumnConfig from './table-column-config';
import store from '../store';

const SORT_OPTION = [
  {
    value: '-created_at',
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_down' />
        按创建时间最新的在前
      </div>
    ),
  },
  {
    value: 'created_at',
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_up' />
        按创建时间最旧的在前
      </div>
    ),
  },
  {
    value: '-updated_at',
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_down' />
        按修改时间最新的在前
      </div>
    ),
  },
  {
    value: 'updated_at',
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_up' />
        按修改时间最旧的在前
      </div>
    ),
  },
  // {
  //   label: (
  //     <div className='flex items-center'>
  //       <Icon className='mr-8' name='mediation' />
  //     自定义排序规则
  //     </div>
  //   ),
  //   value: '5',
  // },
];

const PAGE_SIZE_OPTION = [
  { label: '10条/页', value: 10 },
  { label: '20条/页', value: 20 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 },
  { label: '500条/页', value: 500 },
  { label: '1000条/页', value: 1000 },
];

const FIXED_RULE_OPTION = [
  { label: '无固定列', value: 'none' },
  { label: '固定首列', value: 'one' },
  { label: '固定前两列', value: 'previous_two' },
];

type ConfigItemRenderProps = { title: JSX.Element | string; children: ReactChild };

function ConfigItemRender({ title, children }: ConfigItemRenderProps): JSX.Element {
  return (
    <div className='mt-24'>
      <div className='mb-8 text-body2'>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function PageSettingConfig(): JSX.Element {
  return (
    <div className='page-setting-option'>
      <p className='text-caption-no-color text-gray-400'>选择配置以下内容以定义页面视图的显示元素。</p>
      <ConfigItemRender title="筛选条件">
        <FilterSetting />
      </ConfigItemRender>
      <ConfigItemRender title="排序规则">
        <Select
          value={store.pageTableShowRule.order}
          onChange={(order: string) => store.setPageTableShowRule({ order })}
          options={SORT_OPTION}
        />
      </ConfigItemRender>
      <ConfigItemRender title='分页'>
        <Select
          value={store.pageTableShowRule.pageSize}
          onChange={(pageSize: number) => store.setPageTableShowRule({ pageSize })}
          options={PAGE_SIZE_OPTION}
        />
      </ConfigItemRender>
      <ConfigItemRender title="固定列">
        <Select
          value={store.pageTableShowRule.fixedRule}
          onChange={(fixedRule: string) => store.setPageTableShowRule({ fixedRule })}
          options={FIXED_RULE_OPTION}
        />
      </ConfigItemRender>
      <ConfigItemRender
        title={(
          <div className='flex items-center justify-between'>
            <span>字段显示和排序</span>
            <span>
              <Checkbox
                checked={store.showAllFields}
                indeterminate={store.indeterminateOfSelectedAllColumns}
                onChange={(e) => store.toggleShowAllFields(e.target.checked)}
                label='全选'
              />
            </span>
          </div>
        )}
      >
        <TableColumnConfig
          sortChange={store.pageTableColumnsSort}
          selectFields={store.pageTableColumns}
          fieldList={store.fieldList}
          onChange={store.tableColumnController}
        />
      </ConfigItemRender>
    </div>
  );
}

export default observer(PageSettingConfig);
