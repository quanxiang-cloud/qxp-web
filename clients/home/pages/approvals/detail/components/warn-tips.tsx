import React from 'react';
import dayjs from 'dayjs';

import Icon from '@c/icon';

import CustomAvatar from '../components/custom-avatar';

interface Props {
  workData: FlowItem;
}

export default function WarnTips({ workData }: Props): JSX.Element {
  const { taskName, operationRecords, modifyTime } = workData;

  return (
    <div className="flex w-full">
      <CustomAvatar name="approval" color="bg-indigo-500" />
      <div className="ml-8 flex-1">
        <div className="text-gray-600">{taskName || '设计部填写'}</div>
        <div className="mt-8 px-16 py-8 corner-2-8-8-8 bg-white text-yellow-600 text-12 flex">
          <div className="h-20 flex justify-center items-center">
            <Icon name="info" className="text-current" />
          </div>
          <div className="ml-4">
            {operationRecords.length && operationRecords[0].handleDesc}
          </div>
        </div>
        <div className="text-12 text-gray-400 mt-4">
          {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </div>
  );
}
