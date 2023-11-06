import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';

import Pagination from '@c/pagination';
import RadioButtonGroup from '@c/radio/radio-button-group';

import store from './store';
import TaskList from '../task-list';
import { APPROVAL, FILL_IN, listData } from '../constant';

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
  { label: '待补充', value: 'SEND_BACK' },
];

const sortOptions = [
  { value: 'DESC', label: '最新的代办优先' },
  { value: 'ASC', label: '最早的代办优先' },
];

function TodoApprovals(props: any): JSX.Element {
  const { approvelCount = 0, fillInCount = 0 } = props;
  const [currentValue, setCurrentValue] = useState(APPROVAL);
  const { search, pathname } = useLocation();
  const searchParams = new URLSearchParams(search);
  useEffect(() => {
    document.title = '我的流程 - 待处理列表'; // todo
    store.tagType = searchParams.get('tagType') || '';
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
      <div className="flex justify-between items-center mb-16">
        <div className="flex flex-1">
          <RadioButtonGroup
            className="mr-16"
            radioBtnClass="bg-white"
            onChange={handleChange}
            currentValue={currentValue}
            disabled={store.loading}
            listData={listData.map((item: any)=>{
              switch (item?.value) {
              case 'fillIn':
                return { ...item,
                  count: fillInCount,
                };
              case 'approval':
                return { ...item,
                  count: approvelCount,
                };
              }
            })}
          />
          {/* <RadioButtonGroup
            className="mr-16"
            radioBtnClass="bg-white"
            onChange={(value) => {
              history.push(`${pathname}${value ? '?tagType=' : ''}${value}`);
              store.changeTagType(value as string);
            }}
            listData={status as any}
            currentValue={store.tagType}
            radioLabelRender={({ value, label }) => {
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
              return label + ' · ' + count;
            }}
          /> */}
          {/* <Select
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
          /> */}
          {/* <Checkbox label="仅看我代理的" className="mr-auto" />*/}
        </div>
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
