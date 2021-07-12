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

function AllApprovals(): JSX.Element {
  useEffect(() => {
    document.title = '我的流程 - 全部';
    store.fetchAll();

    return () => {
      store.reset();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1" />
        <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword} onChange={store.changeKeyword} />
        <Select multiple={false} options={sortOptions} onChange={store.changeOrderType} value={store.orderType}>
          <IconBtn
            iconName="import_export"
            className="border-none hover:bg-gray-100"
            style={{ border: 'none' }}
            iconProps={{
              type: 'primary',
            }}
          />
        </Select>
      </div>
      <TaskList tasks={store.approvals} store={store} taskType='all' type="ALL_PAGE" />
      <Pagination current={store.pageNumber} total={store.total} pageSize={store.pageSize} onChange={store.paginate} />
    </div>
  );
}

export default observer(AllApprovals);
