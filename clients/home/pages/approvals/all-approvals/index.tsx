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

function AllApprovals(): JSX.Element {
  const [currentValue, setCurrentValue] = useState(APPROVAL);

  useEffect(() => {
    document.title = '我的流程 - 全部';
    // store.fetchAll();

    return () => {
      store.reset();
    };
  }, []);

  useEffect(()=>{
    store.query.page = 1;
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
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1" >
          <RadioButtonGroup
            className="mr-16"
            radioBtnClass="bg-white"
            onChange={handleChange}
            currentValue={currentValue}
            listData={listData}
          />
        </div>
        {/* <Search
          className="w-259 mr-16"
          placeholder="搜索流程、发起人、应用"
          value={store.keyword}
          onChange={store.changeKeyword}
        />
        <Select
          multiple={false}
          options={sortOptions}
          value={store.orderType}
          onChange={store.changeOrderType}
        >
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
      <TaskList tasks={store.approvals} store={store} taskType='all' type="ALL_PAGE" />
      <Pagination
        current={store.pageNumber}
        total={store.total}
        pageSize={store.pageSize}
        onChange={store.paginate}
      />
    </div>
  );
}

export default observer(AllApprovals);
