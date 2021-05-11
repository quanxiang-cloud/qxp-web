import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Switch from '@c/switch';
import Select from '@c/select';
import Search from '@c/search';
import Pagination from '@c/pagination';
import IconBtn from '@c/icon-btn';
import Button from '@c/button';
import Modal from '@c/modal';

import store from './store';
import TaskList from '../task-list';

const status = [
  { label: '全部', value: -1 },
  { label: '未读', value: 0 },
];

const sortOptions = [
  { value: 'DESC', label: '最新的代办优先' },
  { value: 'ASC', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  const [openReadFlow, setOpenReadFlow] = useState(false);

  useEffect(() => {
    document.title = '我的流程 - 抄送给我的';
    store.fetchAll();

    return () => {
      store.reset();
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1">
          <Switch
            className="mr-16"
            onChange={store.changeStatus}
            options={status}
          />
        </div>
        <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword}
                onChange={store.changeKeyword} />
        <Select multiple={false} options={sortOptions} onChange={store.changeOrderType}>
          <IconBtn iconName="import_export" className="btn-sort" />
        </Select>
        <Button
          className="bg-gray-700 ml-16"
          onClick={()=> setOpenReadFlow(true)}
          modifier="primary"
          iconName="done_all"
        >
          全部标为已读
        </Button>
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
      {openReadFlow && (
        <Modal
          title="全部标为已读"
          onConfirm={store.readFlow}
          onClose={()=> setOpenReadFlow(false)}
        >
          确定要将所有未读抄送标记为已读吗？
        </Modal>
      )}
    </div>
  );
}

export default observer(TodoApprovals);
