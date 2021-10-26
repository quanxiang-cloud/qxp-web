import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import Switch from '@c/switch';
import Search from '@c/search';
import Pagination from '@c/pagination';
import Button from '@c/button';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Select from '@c/select';
import IconBtn from '@c/icon-btn';

import store from './store';
import TaskList from '../task-list';
import { readAll } from '../api';

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
  const history = useHistory();

  useEffect(() => {
    document.title = '我的流程 - 抄送给我';
    store.fetchAll();

    return () => {
      store.reset();
    };
  }, []);

  const setReadAll = async () => {
    try {
      const data = await readAll(store.approvals.map((item) => item.id));
      if (data) {
        toast.success('操作成功');
        setOpenReadFlow(false);
        await store.fetchAll();
        history.go(0);
      }
      setOpenReadFlow(false);
    } catch (err: any) {
      toast.error(`操作失败: ${err.message}`);
    }
  };

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
        <Button
          className="bg-gray-700 mr-16"
          onClick={() => setOpenReadFlow(true)}
          modifier="primary"
          iconName="done_all"
        >
          全部标为已读
        </Button>
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
      <TaskList tasks={store.approvals} store={store} taskType='cc_to_me' type='CC_PAGE' />
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
          footerBtns={[
            {
              key: 'close',
              onClick: () => setOpenReadFlow(false),
              text: '取消',
            },
            {
              key: 'ok',
              onClick: setReadAll,
              text: '确定',
            },
          ]}
          onClose={() => setOpenReadFlow(false)}
        >
          <p className="p-20">确定要将所有未读抄送标记为已读吗？</p>
        </Modal>
      )}
    </div>
  );
}

export default observer(TodoApprovals);
