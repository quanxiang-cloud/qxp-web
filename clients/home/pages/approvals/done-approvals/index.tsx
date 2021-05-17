import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Search from '@c/search';
import Pagination from '@c/pagination';
import Select from '@c/select';
import IconBtn from '@c/icon-btn';

import store from './store';
import TaskList from '../task-list';

const sortOptions = [
  { value: 'DESC', label: '最新的代办优先' },
  { value: 'ASC', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  useEffect(() => {
    document.title = '我的流程 - 我已处理';
    store.fetchAll();

    return () => {
      store.reset();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1" />
        <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword}
          onChange={store.changeKeyword} />
        <Select multiple={false} options={sortOptions} onChange={store.changeOrderType}>
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
