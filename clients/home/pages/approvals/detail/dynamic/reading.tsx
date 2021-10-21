import React from 'react';
import dayjs from 'dayjs';

import Avatar from '@c/avatar';

import UserList from '../components/user-list';
import Describe from '../components/describe';

interface Props {
  workData: FlowItem;
  clickHandle: (value: FlowItem) => void;
}

export default function Reading({ workData, clickHandle }: Props): JSX.Element {
  const { creatorName, operationRecords, modifyTime, reason } = workData;

  function goLeaderHandle(): void {
    clickHandle(workData);
  }

  function filterRead(data: OperationRecord[]): number {
    const readData = data.filter((operation) => operation.status === 'COMPLETED');
    return readData.length;
  }

  return (
    <div className="flex w-full">
      <Avatar username={creatorName.substring(0, 1)} />
      <div className="ml-8 flex-1">
        <div className="h-24 flex justify-between">
          <div className="flex items-center">
            <span className="text-h6-bold mr-4">{creatorName}</span>
            <span className="text-gray-600 mb-8">
              邀请{operationRecords.length}人进行阅示，{filterRead(operationRecords)}人已阅
            </span>
          </div>
        </div>
        <UserList userList={operationRecords} clickHandle={goLeaderHandle} />
        {
          reason && (
            <Describe describeInfo={{ detail: reason }} />
          )
        }
        <div className="text-12 text-gray-400 mt-4">
          {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </div>
  );
}
