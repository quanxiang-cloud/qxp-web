import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

import Switch from '@c/switch';
import Select from '@c/select';
import Search from '@c/search';
import Pagination from '@c/pagination';
import IconBtn from '@c/icon-btn';

import store from './store';
import TaskList from '../task-list';
import { getFlowInstanceCount } from '../api';

const status = [
  { label: '全部', value: '' },
  { label: '已超时', value: 'OVERTIME' },
  { label: '被催办', value: 'URGE' },
];

const handleTypes = [
  { label: '全部', value: 'ALL' },
  { label: '待审批', value: 'REVIEW' },
  { label: '待填写', value: 'WRITE' },
  { label: '待阅示', value: 'READ' },
  { label: '其他', value: 'OTHER' },
];

const sortOptions = [
  { value: 'DESC', label: '最新的代办优先' },
  { value: 'ASC', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  const { search, pathname } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();
  const { data: flowInstCount } = useQuery(['flow-instance-count'], async () => {
    return await getFlowInstanceCount({});
  });

  useEffect(() => {
    document.title = '我的流程 - 待处理列表'; // todo
    store.tagType = searchParams.get('tagType') || '';
    store.fetchAll();

    return () => {
      store.reset();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1">
          <Switch
            className="mr-16"
            onChange={(value) => {
              history.push(`${pathname}${value ? '?tagType=' : ''}${value}`);
              store.changeTagType(value);
            }}
            value={store.tagType}
            options={status}
            optionRenderer={({ value, label }) => {
              let count = 0;
              if (value === '') {
                count = flowInstCount?.waitHandleCount || 0;
              }
              if (value === 'OVERTIME') {
                count = flowInstCount?.overTimeCount || 0;
              }
              if (value === 'URGE') {
                count = flowInstCount?.urgeCount || 0;
              }
              return (
                <span>{label + ' · ' + count}</span>
              );
            }}
          />
          <Select
            className="mr-16"
            multiple={false}
            value={store.handleType}
            options={handleTypes}
            onChange={store.changeHandleType}
            triggerRender={(option) => {
              return (
                <span className="text-sm"><span
                  className="text-gray-400 mr-10">处理类型:</span>{option?.selectedOption?.label || '请选择'}</span>
              );
            }}
          />
          {/* <Checkbox label="仅看我代理的" className="mr-auto" />*/}
        </div>
        <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword}
          onChange={store.changeKeyword} />
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
      <TaskList tasks={store.approvals} store={store} taskType='todo' type='WAIT_HANDLE_PAGE' />
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
