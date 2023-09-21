import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Pagination from '@c/pagination';

import store from './store';
import TaskList from '../task-list';
import RadioButtonGroup from '@c/radio/radio-button-group';
import { APPROVAL, FILL_IN, listData } from '../constant';

const sortOptions = [
  { value: 'DESC', label: '最新的代办优先' },
  { value: 'ASC', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  const [currentValue, setCurrentValue] = useState(APPROVAL);

  useEffect(() => {
    document.title = '我的流程 - 我已处理';
    // store.fetchAll();

    return () => {
      store.reset();
    };
  }, []);

  useEffect(()=>{
    switch (currentValue) {
    case FILL_IN:
      store.type = FILL_IN;
      store.fetchFillInAll();
      break;
    default:
      store.type = APPROVAL;
      store.fetchAll();
      break;
    }
  }, [currentValue]);

  const handleChange = (val: any)=>{
    setCurrentValue(val);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-16">
        <div className="flex flex-1">
          <RadioButtonGroup
            className="mr-16"
            radioBtnClass="bg-white"
            onChange={handleChange}
            currentValue={currentValue}
            listData={listData}
          />
        </div>
        <div className="flex">
          {/* <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword}
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
          </Select> */}
        </div>
      </div>
      <TaskList tasks={store.approvals} store={store} taskType='done' type="HANDLED_PAGE" />
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
