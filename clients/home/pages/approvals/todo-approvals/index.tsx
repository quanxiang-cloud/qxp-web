import React from 'react';
import { observer } from 'mobx-react';

import Switch from '@c/switch';
import Select from '@c/select';
import Checkbox from '@c/checkbox';
import Search from '@c/search';
import Pagination from '@c/pagination';
import IconBtn from '@c/icon-btn';

import store from './store';
import ApprovalCard from '../approval-card';

const status = [
  { label: '全部', value: 'ALL' },
  { label: '已超时', value: 'outdate' },
  { label: '被催办', value: 'urge' },
];

const catalogs = [
  { label: '全部', value: '全部' },
  { label: '待审批', value: '待审批' },
  { label: '待填写', value: '待填写' },
  { label: '待阅示', value: '待阅示' },
  { label: '其他', value: '其他' },
];

const sortOptions = [
  { value: 'updated_time', label: '最新的代办优先' },
  { value: 'created_time', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <Switch
          className="mr-16"
          onChange={(value) => store.changeStatus(value)}
          options={status}
        />
        <Select
          className="mr-16"
          multiple={false}
          value={store.catalog}
          options={catalogs}
          onChange={(value) => store.changeCatalog(value)}
        />
        <Checkbox label="仅看我代理的" className="mr-auto" />
        <Search className="mr-16" placeholder="搜索流程、发起人等" />
        <Select multiple={false} options={sortOptions}>
          <IconBtn iconName="sort" />
        </Select>
      </div>
      {store.approvals.map((approval) => {
        return (<ApprovalCard key={approval.id} />);
      })}
      <Pagination current={store.pageNumber} pageSize={store.pageSize} onChange={store.paginate} />
    </div>
  );
}

export default observer(TodoApprovals);
