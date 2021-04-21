import React, { useEffect, useState, useMemo } from 'react';
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
  { label: '30条/页', value: 30 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 },
  { label: '200条/页', value: 200 },
];

function PageSettingConfig() {
  const { fieldList } = store;
  const [indeterminate, setIndeterminate] = useState(false);

  const showListLength = useMemo(() => {
    return store.fieldList.filter((field) => field.visible).length;
  }, [store.fieldList]);

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
      store.setAllPageConfig(
        fieldList.map(({ id }) => ({ id, visible: true }))
      );
    } else {
      store.setAllPageConfig(
        fieldList.map(({ id }) => ({ id, visible: false }))
      );
    }
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      store.setPageConfig(e.target.value, { visible: true });
    } else {
      store.setPageConfig(e.target.value, { visible: false });
    }
  };

  const handleSort = (keys: string[]) => {
    store.setAllPageConfig(
      keys.map((id: string, index: number) => ({ id, sort: index }))
    );
  };

  return (
    <div className='page-setting-option'>
      <p className='text-caption-no-color text-gray-400'>选择配置以下内容以定义页面视图的显示元素。</p>
      {configItemRender('筛选条件', <FilterSetting />)}
      {configItemRender('排序规则', <Select options={SORT_OPTION} />)}
      {configItemRender(
        <div className='flex items-center justify-between'>
          <span>分页</span><Toggle onChange={() => { }} onText='开启' offText='关闭' />
        </div>,
        <Select options={PAGE_SIZE_OPTION} />
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
          fieldList={store.fieldList}
          showOnChange={handleChecked}
        />
      )}
    </div>
  );
}

export default observer(PageSettingConfig);
