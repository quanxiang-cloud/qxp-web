import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Search from '@c/search';

import store from '../store';

function ModelNavTools(): JSX.Element {
  const { initDataModelSchema, dataModelList, setSearchModelInput, setEditModalType } = store;

  function handleSearchChange(val: string): void {
    setSearchModelInput(val);
  }

  return (
    <>
      <Search
        placeholder='搜索数据模型名称'
        className="w-208 border-none border-r-1"
        onChange={handleSearchChange}
      />
      <div className="px-16 pt-16">{`共 ${dataModelList.length} 条数据`}</div>
      <div
        className="add-data-model"
        onClick={() => {
          initDataModelSchema();
          setEditModalType('create');
        }}
      >
        <Icon name="add" size={20} />
        <span className="ml-4">添加数据模型</span>
      </div>
    </>
  );
}

export default observer(ModelNavTools);
