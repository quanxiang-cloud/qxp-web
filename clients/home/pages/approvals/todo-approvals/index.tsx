import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Switch from '@c/switch';
import Select from '@c/select';
import Search from '@c/search';
import Pagination from '@c/pagination';
import IconBtn from '@c/icon-btn';

import store from './store';
import TaskList from '../task-list';

const status = [
  { label: '全部', value: '' },
  { label: '已超时', value: 'OVERTIME' },
  { label: '被催办', value: 'URGE' },
];

const handleTypes = [
  { label: '全部', value: '' },
  { label: '待审批', value: 'REVIEW' },
  { label: '待填写', value: 'WRITE' },
  { label: '待阅示', value: 'READ' },
  { label: '其他', value: 'OTHER' },
];

const sortOptions = [
  { value: 'updated_time', label: '最新的代办优先' },
  { value: 'created_time', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  useEffect(() => {
    document.title = '我的流程 - 待处理列表'; // todo
    store.fetchApprovals();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1">
          <Switch
            className="mr-16"
            onChange={store.changeTagType}
            defaultValue={store.status}
            options={status}
          />
          <Select
            className="mr-16"
            multiple={false}
            value={store.handleType}
            options={handleTypes}
            onChange={store.changeHandleType}
          />
          {/* <Checkbox label="仅看我代理的" className="mr-auto" />*/}
        </div>
        <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword}
          onChange={store.changeKeyword} />
        <Select multiple={false} options={sortOptions}>
          <IconBtn iconName="import_export" className="btn-sort" />
        </Select>
      </div>
      <TaskList tasks={store.approvals} store={store} taskType='todo' />
      <Pagination
        current={store.pageNumber}
        total={store.total}
        pageSize={store.pageSize}
        onChange={store.paginate}
        renderTotalTip={(total) => (
          <div className="text-12 text-gray-600">
            共<span className="mx-4">{store.total || 0}</span>条数据
          </div>
        )}
      />
    </div>
  );
}

export default observer(TodoApprovals);
