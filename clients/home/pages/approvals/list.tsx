import React from 'react';
import cs from 'classnames';

import { useURLSearch } from '@lib/hooks';
import Icon from '@c/icon';
import TodoApprovals from './todo-approvals';
import CCToMeApprovals from './cc-to-me-approvals';
import MyApplyApprovals from './my-applies';
import DoneApprovals from './done-approvals';
import AllApprovals from './all-approvals';

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
}

const typeIconMap = {
  todo: 'alarm',
  done: 'done_all',
  cc_to_me: 'send',
  my_applies: 'addchart',
  all: 'format_align_justify',
};

function ApprovalTypeList({ listType, onClick }: ApprovalTypeListProps): JSX.Element {
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

  function handleChangeList(toList: string) {
    setSearch({ list: toList });
  }

  return (
    <div className="main-content flex">
      <ApprovalTypeList listType={listType as ListType} onClick={handleChangeList} />
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
