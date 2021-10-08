import React from 'react';
import dayjs from 'dayjs';

import Avatar from '@c/avatar';

import ApprovalStatus from '../components/approval-status';
import CustomAvatar from '../components/custom-avatar';
import UserList from '../components/user-list';
// import WarnTips from '../components/warn-tips';
import Describe from '../components/describe';

type FlowStatusValue = Record<string, any>;

const NoOperationValue: FlowStatusValue = {
  OR_FILLIN: '或填',
  AND_FILLIN: '全填',
};

interface Props {
  workData: FlowItem;
  clickHandle: (value: FlowItem) => void;
}

export default function Fill({ workData, clickHandle }: Props): JSX.Element {
  const { taskName, taskType, modifyTime, operationRecords, status } = workData;

  function goLeaderHandle(): void {
    clickHandle(workData);
  }

  function showDetailText(status: StatusValues): {
    username: string, detail: string, backOffInfo: string, sendBack: string
  } {
    const detailInfo = { username: '', detail: '', backOffInfo: '', sendBack: '' };
    const refuseData = workData.operationRecords.filter(
      (operation: OperationRecord) => operation.handleType === status);
    detailInfo.detail = refuseData[0].remark || '';
    switch (status) {
    case 'REFUSE':
      detailInfo.username = refuseData[0].creatorName || '';
      break;
    case 'STEP_BACK':
      detailInfo.username = refuseData[0].creatorName || '';
      detailInfo.backOffInfo = refuseData[0].handleDesc || '';
      break;
    case 'SEND_BACK':
      detailInfo.username = refuseData[0].creatorName || '';
      detailInfo.sendBack = refuseData[0].handleDesc || '';
      break;
    }

    return detailInfo;
  }

  const username = operationRecords?.length ? operationRecords[0].creatorName : '';
  const isHandle = ['REVIEW', 'IN_REVIEW'].includes(status);
  const isSingle = operationRecords?.length === 1;
  const isCancel = status === 'CANCEL';
  const confirmBack = ['REFUSE', 'SEND_BACK', 'READ', 'DELIVER', 'STEP_BACK'].includes(status);
  return (
    <div className="flex w-full">
      {isHandle && <CustomAvatar name="hourglass_empty" />}
      { (!isHandle && isSingle) && <Avatar username={username.substring(0, 1)} />}
      { (!isHandle && !isSingle) && <CustomAvatar name="edit" style={{ background: '#14B8A6' }} />}
      <div className="ml-8 flex-1">
        {
          isHandle ? (
            <div className="h-24 flex items-center justify-between">
              {isHandle &&
              (<div className="text-12 text-gray-600">
                {taskName}（{operationRecords?.length}人处理中 · {NoOperationValue[taskType]}）
              </div>)
              }
            </div>
          ) : (
            <div className="h-24 flex justify-between">
              <div className="flex items-center">
                {isSingle && <span className="text-h6-bold mr-4">{username}</span>}
                <span className="text-gray-600">{taskName}</span>
              </div>
              <ApprovalStatus status={status} />
            </div>
          )
        }
        {
          (!isSingle || isHandle) && !isCancel && (
            <UserList userList={operationRecords} clickHandle={goLeaderHandle} />
          )
        }
        {
          (confirmBack || ('FILL_IN' === status && isSingle)) && (<Describe
            describeInfo={showDetailText(status)}
          />)
        }
        {/* <WarnTips status="handle" /> */}
        <div className="text-12 text-gray-400 mt-4">
          {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </div>
  );
}
