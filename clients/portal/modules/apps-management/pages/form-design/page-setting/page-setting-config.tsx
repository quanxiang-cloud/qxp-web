import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Select from '@c/select';
import Checkbox from '@c/checkbox';
import Toggle from '@c/toggle';

import FilterSetting from './filter-setting';
import FieldSort from './field-sort';
import store from '../store';

const SORT_OPTION = [
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_down' />
      按创建时间最新的在前
      </div>
    ),
    value: '-created_at',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_up' />
      按创建时间最旧的在前
      </div>
    ),
    value: 'created_at',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_down' />
      按修改时间最新的在前
      </div>
    ),
    value: '-updated_at',
  },
  {
    label: (
      <div className='flex items-center'>
        <Icon className='mr-8' name='arrow_circle_up' />
      按修改时间最旧的在前
      </div>
    ),
    value: 'updated_at',
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
];

const FIXED_RULE_OPTION = [
  { label: '无固定列', value: '' },
  { label: '固定首列', value: 'one' },
  { label: '固定前两列', value: 'previous_two' },
  { label: '固定操作列', value: 'action' },
  { label: '固定首列和操作列', value: 'one_action' },
];

function PageSettingConfig(): JSX.Element {
  const { fieldList, pageTableShowRule, setPageTableShowRule, pageTableColumns } = store;
  const [indeterminate, setIndeterminate] = useState(false);

  const showListLength = pageTableColumns.length;

  useEffect(() => {
    if (showListLength === 0 || showListLength === fieldList.length) {
      setIndeterminate(false);
    } else {
      setIndeterminate(true);
    }
  }, [showListLength]);

  const configItemRender = (title: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className='mt-24'>
        <div className='mb-8 text-body2'>{title}</div>
        <div>{content}</div>
      </div>
    );
  };

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      store.setPageTableColumns(
        fieldList.map(({ id }) => id),
      );
    } else {
      store.setPageTableColumns([]);
    }
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      store.setPageTableColumns([...pageTableColumns, e.target.value]);
    } else {
      store.setPageTableColumns(pageTableColumns.filter((id) => id !== e.target.value));
    }
  };

  const handleSort = (keys: string[]) => {
    store.setPageTableColumns(keys);
  };

  return (
    <div className='page-setting-option'>
      <p className='text-caption-no-color text-gray-400'>选择配置以下内容以定义页面视图的显示元素。</p>
      {configItemRender('筛选条件', <FilterSetting />)}
      {configItemRender('排序规则',
        <Select
          value={pageTableShowRule.order}
          onChange={(order: string) => setPageTableShowRule({ order })}
          options={SORT_OPTION}
        />,
      )}
      {configItemRender(
        <div className='flex items-center justify-between'>
          <span>分页</span>
          <Toggle
            defaultChecked={!!pageTableShowRule.pageSize}
            onChange={(flag: boolean) => setPageTableShowRule({ pageSize: flag ? 10 : null })}
            onText='开启'
            offText='关闭'
          />
        </div>,
        <Select
          value={pageTableShowRule.pageSize || 0}
          onChange={(pageSize: number) => setPageTableShowRule({ pageSize })}
          disabled={!pageTableShowRule.pageSize}
          options={PAGE_SIZE_OPTION} />,
      )}
      {configItemRender('固定列  ',
        <Select
          value={pageTableShowRule.fixedRule}
          onChange={(fixedRule: string) => setPageTableShowRule({ fixedRule })}
          options={FIXED_RULE_OPTION}
        />,
      )}
      {configItemRender(
        <div className='flex items-center justify-between'>
          <span>字段显示和排序</span>
          <span>
            <Checkbox
              checked={showListLength === fieldList.length}
              indeterminate={indeterminate}
              onChange={handleCheckAll}
              label='全选' />
          </span>
        </div>,
        <FieldSort
          sortChange={handleSort}
          selectKeys={pageTableColumns}
          fieldList={store.fieldList}
          showOnChange={handleChecked}
        />,
      )}
    </div>
  );
}

export default observer(PageSettingConfig);
