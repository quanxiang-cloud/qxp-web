import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Select from '@c/select';
import Pagination from '@c/pagination';
import RangePicker from '@c/range-picker';

import store from './store';
import TaskList from '../task-list';
import RadioButtonGroup from '@c/radio/radio-button-group';
import { APPROVAL, FILL_IN, listData } from '../constant';

// handle type : ALL，REVIEW, WRITE， READ， OTHER
const status = [
  { label: '全部', value: 'ALL' },
  { label: '待补充', value: 'SEND_BACK' },
  { label: '进行中', value: 'REVIEW' },
  { label: '已拒绝', value: 'REFUSE' },
  { label: '已通过', value: 'AGREE' },
  { label: '已撤销', value: 'CANCEL' },
];

const fillStatus = [
  { label: '全部', value: 'ALL' },
  { label: '进行中', value: 'Pending' },
  { label: '已完成', value: 'Finish' },
];

const sortOptions = [
  { value: 'DESC', label: '最新的代办优先' },
  { value: 'ASC', label: '最早的代办优先' },
];

function TodoApprovals(): JSX.Element {
  const [currentValue, setCurrentValue] = useState(APPROVAL);
  const [currentStatus, setCurrentStatus] = useState(status);
  useEffect(() => {
    document.title = '我的流程 - 我发起的';
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
      setCurrentStatus(fillStatus);
      break;
    default:
      store.type = APPROVAL;
      store.fetchAll();
      setCurrentStatus(status);
      break;
    }
  }, [currentValue]);

  const handleChange = (val: any)=>{
    setCurrentValue(val);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1">
          <RadioButtonGroup
            className="mr-16"
            radioBtnClass="bg-white"
            onChange={handleChange}
            currentValue={currentValue}
            listData={listData}
            disabled={store.loading}
          />
          {
            (<Select
              className="mr-16"
              multiple={false}
              value={store.status}
              options={ currentStatus}
              onChange={store.changeStatus}
              triggerRender={(option) => {
                return (
                  <span className="text-sm"><span
                    className="text-gray-400 mr-10">状态:</span>{option?.selectedOption?.label || '请选择'}</span>
                );
              }}
            />)
          }
          <RangePicker onChange={store.changeDate} readableCode={store.readableDate} className="w-259" />
          {/* <Checkbox label="仅看我代理的" className="mr-auto" />*/}
        </div>
        {
          // currentValue === APPROVAL &&
          // (<>
          //   <Search className="w-259 mr-16" placeholder="搜索流程、发起人、应用" value={store.keyword}
          //     onChange={store.changeKeyword} />
          //   <Select
          //     multiple={false}
          //     options={sortOptions}
          //     onChange={store.changeOrderType}
          //     value={store.orderType}
          //   >
          //     <IconBtn
          //       iconName="import_export"
          //       className="border-none hover:bg-gray-100"
          //       style={{ border: 'none' }}
          //       iconProps={{
          //         type: 'primary',
          //       }}
          //     />
          //   </Select>
          // </>)
        }

      </div>
      <TaskList tasks={store.approvals} store={store} taskType='my_applies' type="APPLY_PAGE" />
      <Pagination
        current={store.pageNumber}
        total={store.total}
        pageSize={store.pageSize}
        onChange={store.paginate}
        renderTotalTip={() => (
          <div className="text-12 text-gray-600">
            共<span className="mx-4">{store.total || 0}</span>条数据
          </div>
        )}
      />
    </div>
  );
}

export default observer(TodoApprovals);
