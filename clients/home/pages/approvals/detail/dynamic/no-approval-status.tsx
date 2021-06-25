// 非审批状态（开始，结束，待补充，撤销）
import React from 'react';
import dayjs from 'dayjs';

import Avatar from '@c/avatar';

import CustomAvatar from '../components/custom-avatar';

interface Props {
  workData: FlowItem;
}

export default function RevokeWork({ workData }: Props): JSX.Element {
  const { taskType, creatorName, flowName, status } = workData;

  return (
    <div className="flex w-full">
      <div className="w-24">
        {(('START' === taskType && status !== '') || 'CANCEL' === taskType) &&
        <Avatar username={creatorName.substring(0, 1)} />}
        {(taskType === 'START' && status === '') && <CustomAvatar name='hourglass_empty' />}
        {taskType === 'END' && <CustomAvatar name='stop_circle' />}
      </div>
      <div className="ml-8 flex-1">
        <div>
          {(taskType === 'START' && status !== '') && (<>
            <span className="text-h6-bold mr-4">{creatorName}</span> 发起了 {flowName}
          </>)}
          {taskType === 'CANCEL' && (<>
            <span className="text-h6-bold mr-4">{creatorName}</span> 撤销了 {flowName}
          </>)}
          {(taskType === 'START' && status === '') && (<>
            待 <span className="text-h6-bold mr-4">{creatorName}</span> 补充信息并重新提交
          </>)}
          {taskType === 'END' && (<>
            {flowName} 已结束
          </>)}
        </div>
        <div className="text-12 text-gray-400 mt-4">
          {dayjs(workData.createTime).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </div>
  );
}
