import dayjs from 'dayjs';

import { AttachFile, OperationRecordMobile, ProcessHistory } from '@m/pages/new-approvals/types';
import { FlowAvatarNames } from '@m/components/flow/avatar-name-row';

const NoOperationValue: { [key: string]: string } = {
  OR_APPROVAL: '或签',
  AND_APPROVAL: '会签',
  OR_FILLIN: '任填',
  AND_FILLIN: '全填',
};

export interface DescribeModel {
  userName?: string;
  stepBack?: string;
  sendBack?: string;
  remark?: string;
  attachFiles?: AttachFile[];
}

export interface UserListModel {
  history: ProcessHistory,
  operationRecords: OperationRecordMobile[]
}

export type TimelineStatus = 'end' | 'processing' | 'other';

export interface StatusData {
  id: string;
  avatarNameRow?: AvatarNameRowProps;
  userList?: UserListModel;
  describes?: DescribeModel[];
  warning?: string;
  time?: string;
  timeline: TimelineStatus;
}

export interface RichText {
  text: string;
  className?: string;
}

export interface AvatarNameRowProps {
  avatar?: FlowAvatarNames;
  userName?: string;
  text?: RichText[];
  status?: string;
}

function getHandledIcon(taskType: string): FlowAvatarNames {
  return ['OR_FILLIN', 'AND_FILLIN'].includes(taskType) ? 'edit' : 'approval';
}

export function mapStatusData(histories: ProcessHistory[]): StatusData[] {
  const result: StatusData[] = [];
  histories.forEach((history, index) => {
    if (!history.isDeleted) {
      const { taskName, taskType, modifyTime, operationRecords, status, creatorName, flowName } = history;
      const isHandle = ['REVIEW', 'IN_REVIEW'].includes(status);
      const isSingle = operationRecords?.length === 1;
      const isApproval = ['OR_APPROVAL', 'AND_APPROVAL', 'OR_FILLIN', 'AND_FILLIN', 'FILL'].includes(taskType);

      const username = isApproval && isSingle ? operationRecords[0]?.creatorName : creatorName;

      const avatarNameRow: AvatarNameRowProps = {
        userName: username,
        // avatar: isApproval && isSingle ? operationRecords[0]?.creatorAvatar : history.creatorAvatar,
      };

      const statusData: StatusData = {
        id: history.id,
        avatarNameRow,
        describes: getDescribes(history),
        time: modifyTime ? dayjs(modifyTime).format('YYYY-MM-DD HH:mm') : '',
        timeline: 'other',
      };

      // Timeline
      if (index === 0) {
        if (taskType === 'END' || status === 'ABEND') {
          statusData.timeline = 'end';
        } else {
          statusData.timeline = 'processing';
        }
      }

      // UserList
      const length = operationRecords?.length || 0;
      if ((isApproval && (isHandle || length > 1)) || ['CC', 'READ'].includes(taskType)) {
        statusData.userList = {
          history,
          operationRecords,
        };
      }

      const creator = username ? { text: username, className: 'title3 mr-4' } : { text: '' };
      // Handle the warning
      if (['AUTO_SKIP', 'AUTO_REVIEW'].includes(status)) {
        // Add the avatar and warning, INSTEAD OF set the status.
        avatarNameRow.status = '';
        avatarNameRow.avatar = getHandledIcon(taskType);

        // Add the warning
        let warning: string | undefined;
        if (operationRecords && operationRecords.length) {
          // Try to get handleDesc
          for (let i = 0; i < operationRecords.length; i += 1) {
            const item = operationRecords[i];
            if (item.handleDesc && item.handleType === status) {
              warning = item.handleDesc;
            } else if (item.handleTaskModel?.handleDesc &&
              item.handleTaskModel?.handleType === status) {
              warning = item.handleTaskModel.handleDesc;
            }
            if (warning) break;
          }
        }
        // Check if the warning is set.
        // If not, add the default warning.
        // At least user can know what's happened, cause there is no status tag shown.
        if (!warning) {
          warning = '该节点下无相关负责人，已自动跳过';
        }
        statusData.warning = warning;
        avatarNameRow.text = [{ text: taskName }];
      } else if (isApproval) {
        // Avatar
        if (!isSingle || isHandle) {
          avatarNameRow.avatar = isHandle ? 'hourglass_empty' : getHandledIcon(taskType);
        }

        // Text status
        if (isHandle) {
          const handleText = NoOperationValue[taskType];
          avatarNameRow.text = [{
            text: taskType !== 'FILL' ?
              `${taskName}（${length}人处理中${handleText ? ' · ' + handleText : ''}）` :
              `${taskName}（处理中${handleText ? ' · ' + handleText : ''}）`,
          }];
        } else {
          const text: RichText[] = [];
          if (isSingle) {
            text.push(creator);
          }
          text.push({ text: taskName });
          avatarNameRow.text = text;
          avatarNameRow.status = status;
        }
      } else if (taskType === 'CC') {
        if (!username) {
          avatarNameRow.avatar = 'send';
          avatarNameRow.text = [{ text: `抄送给${length}人` }];
        } else {
          avatarNameRow.text = [creator, { text: `抄送给${length}人` }];
        }
      } else if (taskType === 'DELIVER') {
        avatarNameRow.text = [
          creator,
          { text: '转交给' },
          { text: operationRecords[0]?.creatorName || '未知用户', className: 'title3 ml-4 mr-4' },
          { text: '处理' },
        ];
      } else if (taskType === 'READ') {
        avatarNameRow.text = [creator, { text: `邀请${length}人进行阅示，${filterRead(operationRecords)}人已阅` }];
      } else if (taskType === 'START') {
        if (!status || status === 'RE_SUBMIT') { // Need user to fill in
          avatarNameRow.avatar = 'hourglass_empty';
          avatarNameRow.text = [
            { text: '待' },
            { text: username, className: 'title3 ml-4 mr-4' },
            { text: '补充信息并重新提交' },
          ];
        } else {
          avatarNameRow.text = [creator, { text: '发起了', className: 'mr-4' }, { text: flowName }];
        }
      } else if (taskType === 'END') {
        avatarNameRow.avatar = 'stop_circle';
        avatarNameRow.text = [{ text: flowName, className: 'mr-4' }, { text: '已结束' }];
      } else if (taskType === 'CANCEL') {
        avatarNameRow.text = [creator, { text: '撤销了', className: 'mr-4' }, { text: flowName }];
      } else {
        avatarNameRow.text = [{ text: '未知动态' }];
      }

      result.push(statusData);
    }
  });
  return result;
}

export function getDescribes(history: ProcessHistory): DescribeModel[] | undefined {
  const describes: DescribeModel[] = [];

  const { operationRecords, status, taskType, reason } = history;
  const isSingle = operationRecords?.length === 1;

  const describe: DescribeModel = {};
  const backData = operationRecords?.filter(
    (operation) => operation.handleType === status) ?? [];
  const data = backData[0];

  switch (status) {
  case 'STEP_BACK':
    describe.userName = !isSingle ? data?.creatorName : '';
    describe.remark = data?.remark;
    describe.stepBack = data?.handleDesc;
    describe.attachFiles = data?.handleTaskModel?.attachFiles;
    describes.push(describe);
    return describes;
  case 'SEND_BACK':
    describe.userName = !isSingle ? data?.creatorName : '';
    describe.remark = data?.remark;
    describe.sendBack = data?.handleDesc;
    describe.attachFiles = data?.handleTaskModel?.attachFiles;
    describes.push(describe);
    return describes;
  }

  // Not like STEP_BACK and SEND_BACK
  // Only reason is NOT EMPTY,
  // the following situations can push the one
  // into the describes.
  if (reason) {
    switch (taskType) {
    case 'CC':
      describe.remark = reason;
      describes.push(describe);
      return describes;
    case 'READ':
      describe.remark = reason;
      describes.push(describe);
      return describes;
    case 'DELIVER':
      describe.remark = reason;
      describes.push(describe);
      return describes;
    }
  }

  if (operationRecords && operationRecords.length) {
    operationRecords.forEach((operation) => {
      if (operation.handleType === 'STEP_BACK') {
        describes.push({
          userName: !isSingle ? operation.creatorName : '',
          stepBack: operation.handleDesc,
          remark: operation.remark,
          attachFiles: operation.handleTaskModel?.attachFiles,
        });
      } else if (operation.handleType === 'SEND_BACK') {
        describes.push({
          userName: !isSingle ? operation.creatorName : '',
          sendBack: operation.handleDesc,
          remark: operation.remark,
          attachFiles: operation.handleTaskModel?.attachFiles,
        });
      } else if (operation.remark ||
        (operation.handleTaskModel?.attachFiles && operation.handleTaskModel?.attachFiles.length)) {
        describes.push({
          userName: !isSingle ? operation.creatorName : '',
          remark: operation.remark,
          attachFiles: operation.handleTaskModel?.attachFiles,
        });
      }
    });
  }

  return describes;
}

function filterRead(data?: OperationRecordMobile[]): number {
  const readData = data?.filter((operation) => operation.status === 'COMPLETED');
  return readData?.length || 0;
}
