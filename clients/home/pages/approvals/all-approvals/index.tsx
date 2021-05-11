import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Search from '@c/search';
import Pagination from '@c/pagination';

import store from './store';
import TaskList from '../task-list';

function TodoApprovals(): JSX.Element {
  useEffect(() => {
    document.title = '我的流程 - 全部';
    store.fetchAll();

    return () => {
      store.reset();
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1" />
        <Search className="w-259" placeholder="搜索流程、发起人、应用" value={store.keyword} onChange={store.changeKeyword} />
      </div>
      <TaskList tasks={store.approvals} store={store} taskType='todo' />
      <Pagination current={store.pageNumber} total={store.total} pageSize={store.pageSize} onChange={store.paginate} />
    </div>
  );
}

export default observer(TodoApprovals);
