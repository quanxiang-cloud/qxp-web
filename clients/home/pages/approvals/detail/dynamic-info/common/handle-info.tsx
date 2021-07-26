import React from 'react';
import dayjs from 'dayjs';

import Avatar from '@c/avatar';

import ApprovalStatus from '../../components/approval-status';
import Describe from '../../components/describe';

interface Props {
  operation: OperationRecord;
}

export default function HandleInfo({ operation }: Props): JSX.Element {
  const { creatorName, handleType, modifyTime } = operation;

  function showDetailText(status: StatusValues): {
    username: string, detail: string, backOffInfo: string, sendBack: string
  } {
    const detailInfo = { username: '', detail: '', backOffInfo: '', sendBack: '' };
    detailInfo.detail = operation.remark || '';
    switch (status) {
      case 'STEP_BACK': // 回退
        detailInfo.backOffInfo = operation.handleDesc || '';
        break;
      case 'SEND_BACK':
        detailInfo.sendBack = operation.handleDesc || '';
        break;
    }

    return detailInfo;
  }

  return (
    <div className="mb-16 flex w-full">
      <Avatar username={creatorName && creatorName.substring(0, 1)} />
      <div className="ml-8 flex-1">
        <div className="h-24 flex justify-between">
          <div className="flex items-center">
            <span className="text-h6-bold mr-4">{creatorName}</span>
          </div>
          <ApprovalStatus status={handleType} />
        </div>
        <Describe
          describeInfo={showDetailText(handleType)}
        />
        <div className="text-12 text-gray-400 mt-4">
          {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </div>
  );
}
