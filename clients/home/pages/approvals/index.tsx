import React from 'react';
import cs from 'classnames';

import TodoApprovals from './todo-approvals';
import { useHistory, useLocation } from 'react-router';

type ListType = 'todo' | 'done' | 'cc_to_me' | 'my_applies';

// eslint-disable-next-line max-len
const listClassName = 'h-56 flex items-center justify-between hover:bg-blue-100 px-24 font-normal';

const typeList: Array<{ label: string, value: ListType } | 'divide'> = [
  { label: '待我处理', value: 'todo' },
  { label: '我已处理', value: 'done' },
  { label: '抄送给我', value: 'cc_to_me' },
  'divide',
  { label: '我发起的', value: 'my_applies' },
];

function useURLQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

type ApprovalTypeListProps = {
  listType: ListType;
  onClick: (catalog: ListType) => void;
}

function ApprovalTypeList({ listType, onClick }: ApprovalTypeListProps): JSX.Element {
  return (
    <div className="bg-white h-full" style={{ width: '200px' }}>
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
                'text-blue-500 font-medium': value === listType,
              })}
            >
              {label}
            </div>
          );
        })
      }
    </div>
  );
}

function Approvals(): JSX.Element {
  const listType = useURLQuery().get('list') || 'todo';
  const history = useHistory();
  function handleChangeList(toList: string) {
    history.push(`/approvals?list=${toList}`);
  }

  return (
    <div className="main-content flex">
      <ApprovalTypeList listType={listType as ListType} onClick={handleChangeList} />
      <div className="px-20 pt-20 overflow-auto flex-grow">
        {listType === 'todo' && (<TodoApprovals />)}
      </div>
    </div>
  );
}

export default Approvals;
