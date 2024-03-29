import React from 'react';
import dayjs from 'dayjs';

import Avatar from '@c/avatar';

import Describe from '../components/describe';

interface Props {
  workData: FlowItem;
}

export default function Deliver({ workData }: Props): JSX.Element {
  const { creatorName, operationRecords, modifyTime, reason } = workData;

  return (
    <div className="flex w-full">
      <Avatar username={creatorName?.substring(0, 1)} />
      <div className="ml-8 flex-1">
        <div className="h-24 flex justify-between">
          <div className="flex items-center">
            <span className="text-h6-bold mr-4">{creatorName}</span>
            <span className="text-gray-600">
              转交给 <span className="text-14 text-gray-900">{operationRecords[0].creatorName}</span> 处理
            </span>
          </div>
        </div>
        {
          reason && (
            <Describe describeInfo={{ detail: reason }} />
          )
        }
        <div className="text-12 text-gray-400 mt-4">
          {modifyTime && dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </div>
  );
}
