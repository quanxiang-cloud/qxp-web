import React from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';

import { useURLSearch } from '@lib/hooks';
import Icon from '@c/icon';
import BtnBadge from '@c/btn-badge';
import TodoApprovals from './todo-approvals';
import CCToMeApprovals from './cc-to-me-approvals';
import MyApplyApprovals from './my-applies';
import DoneApprovals from './done-approvals';
import AllApprovals from './all-approvals';
import { getFlowInstanceCount } from './api';

type ListType = 'todo' | 'done' | 'cc_to_me' | 'my_applies' | 'all';

// eslint-disable-next-line max-len
const listClassName = 'h-56 flex items-center justify-between hover:bg-blue-100 px-24 font-normal';

const typeList: Array<{ label: string, value: ListType } | 'divide'> = [
  { label: '我发起的', value: 'my_applies' },
  { label: '待我处理', value: 'todo' },
  { label: '我已处理', value: 'done' },
  { label: '抄送给我', value: 'cc_to_me' },
  'divide',
  { label: '全部', value: 'all' },
];

type ApprovalTypeListProps = {
  listType: ListType;
  onClick: (catalog: ListType) => void;
  countMap: Record<string, number | undefined>;
}

const typeIconMap = {
  todo: 'alarm',
  done: 'done_all',
  cc_to_me: 'send',
  my_applies: 'addchart',
  all: 'format_align_justify',
};

function ApprovalTypeList({ listType, countMap, onClick }: ApprovalTypeListProps): JSX.Element {
  const renderCount = (type: ListType): JSX.Element | void => {
    let count = 0;
    if (type === 'todo') {
      count = countMap.waitHandleCount || 0;
    }
    if (type === 'cc_to_me') {
      count = countMap.ccToMeCount || 0;
    }
    if (count > 0) {
      return <BtnBadge count={count} className="relative text-white" />;
    }
  };

  return (
    <div className="bg-white h-full flex-shrink-0" style={{ width: '200px' }}>
      {
        typeList.map((type, index) => {
          if (type === 'divide') {
            return (
              <div key={index} className="mx-24 my-8 h-1 bg-gray-200" />
            );
          }

          const { label, value } = type;
          return (
            <div
              key={value}
              onClick={() => onClick(value)}
              className={cs(listClassName, {
                'cursor-pointer': value !== listType,
                'text-blue-500 font-medium bg-blue-100': value === listType,
              })}
            >
              <span>
                <Icon name={typeIconMap[value]} className="mr-10" />
                {label}
              </span>
              {renderCount(value)}
            </div>
          );
        })
      }
    </div>
  );
}

function Approvals(): JSX.Element {
  const [search, setSearch] = useURLSearch();
  const listType = search.get('list') || 'todo';

  const { data: flowInstCount } = useQuery(['flow-instance-count'], async () => {
    return await getFlowInstanceCount({});
  });

  function handleChangeList(toList: string): void {
    setSearch({ list: toList });
  }

  return (
    <div className="main-content flex">
      <ApprovalTypeList
        listType={listType as ListType}
        onClick={handleChangeList}
        countMap={flowInstCount || {}}
      />
      <div className="px-20 pt-20 overflow-auto flex-grow">
        {listType === 'todo' && (<TodoApprovals />)}
        {listType === 'my_applies' && <MyApplyApprovals />}
        {listType === 'cc_to_me' && <CCToMeApprovals />}
        {listType === 'done' && <DoneApprovals />}
        {listType === 'all' && <AllApprovals />}
      </div>
    </div>
  );
}

export default Approvals;
