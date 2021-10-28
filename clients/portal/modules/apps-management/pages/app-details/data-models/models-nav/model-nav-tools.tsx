import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Search from '@c/search';

import store from '../store';

function ModelNavTools(): JSX.Element {
  const { initDataModelSchema, setSearchModelInput, setEditModalType } = store;

  function handleSearchChange(val: string): void {
    setSearchModelInput(val);
  }

  return (
    <div className="inline-flex items-center mb-8 px-8 text-12">
      <Search
        placeholder='搜索数据模型名称'
        className="model-search"
        onChange={handleSearchChange}
      />
      <div
        className="model-add"
        onClick={() => {
          initDataModelSchema();
          setEditModalType('create');
        }}
      >
        <Icon name="add" type="light" className="flex-shrink-0" size={20} />
      </div>
    </div>
  );
}

export default observer(ModelNavTools);
