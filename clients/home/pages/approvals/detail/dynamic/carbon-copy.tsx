import React from 'react';
import dayjs from 'dayjs';

import Avatar from '@c/avatar';

import CustomAvatar from '../components/custom-avatar';
import UserList from '../components/user-list';
import Describe from '../components/describe';

interface Props {
  workData: FlowItem;
  clickHandle: (value: FlowItem) => void;
}

export default function CarbonCopy({ workData, clickHandle }: Props): JSX.Element {
  const { operationRecords, modifyTime, creatorName, reason } = workData;

  function goLeaderHandle(): void {
    clickHandle(workData);
  }

  const isHaveUser = creatorName ? creatorName : '';

  return (
    <div className="flex w-full">
      {isHaveUser ? <Avatar username={creatorName.substring(0, 1)} /> : <CustomAvatar name="send" />}
      <div className="ml-8 flex-1">
        {
          isHaveUser ? (
            <div className="h-24 flex justify-between">
              <div className="flex items-center">
                <span className="text-h6-bold mr-4">{creatorName}</span>
                <span className="text-gray-600">抄送给{operationRecords.length}人</span>
              </div>
            </div>
          ) : <span className="text-gray-600">抄送给{operationRecords.length}人</span>
        }
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
