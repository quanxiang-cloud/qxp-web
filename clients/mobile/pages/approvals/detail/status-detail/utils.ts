import dayjs from 'dayjs';

import { OperationRecordMobile, ProcessHistory } from '@m/pages/approvals/types';
import { DescribeModel } from '@m/pages/approvals/detail/status/utils';

export interface DetailItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  styleName: 'normal' | 'white';
  status?: string;
  describes?: DescribeModel[];
  time?: string;
}

export interface StatusDetailData {
  title: string;
  warning?: string;
  title1?: string;
  list1?: DetailItem[];
  title2?: string;
  list2?: DetailItem[];
}

export function mapStatusDetail(history: ProcessHistory): StatusDetailData {
  const { taskType, taskName, status, operationRecords } = history;
  const data: StatusDetailData = { title: '' };
  const isApproval = ['OR_APPROVAL', 'AND_APPROVAL', 'OR_FILLIN', 'AND_FILLIN'].includes(taskType || '');
  const isHandle = ['REVIEW', 'IN_REVIEW'].includes(status);

  const { untreatedList, treatedList } = mapList(taskType, status, operationRecords);

  if (isApproval) {
    data.title = taskName || '详情';

    if (isHandle) {
      // Add warning
      let warning = '';
      switch (taskType) {
      case 'OR_APPROVAL':
        warning = '或签：任意一位负责人通过即可';
        break;
      case 'AND_APPROVAL':
        warning = '会签：需全部负责人通过方可通过';
        break;
      case 'OR_FILLIN':
        warning = '任填：任意一位负责人填写即可通过';
        break;
      case 'AND_FILLIN':
        warning = '全填：需全部负责人填写方可通过';
        break;
      }
      data.warning = warning;

      // Add untreated list
      data.list1 = untreatedList;

      if (treatedList.length) {
        data.title2 = '已处理';
        data.list2 = treatedList;
      }
    } else { // task handled
      if (treatedList.length) {
        data.title1 = '已处理';
        data.list1 = treatedList;
      }

      if (untreatedList.length) {
        // Should clear the item's status
        untreatedList.forEach((item) => item.status = undefined);
        data.list2 = untreatedList;
        if (['STEP_BACK', 'SEND_BACK'].includes(status)) {
          data.title2 = '工作流任务已回退，以下负责人未处理';
        } else {
          data.title2 = '工作流任务已结束，以下负责人未处理';
        }
      }
    }
  } else if ('CC' === taskType) {
    data.title = '已抄送给以下人员';
    data.list1 = untreatedList;
  } else if ('READ' === taskType) {
    data.title = '已邀请以下人员阅示';
    data.list1 = untreatedList;
    if (treatedList.length) {
      data.title2 = '已阅示';
    }
    data.list2 = treatedList;
  }

  return data;
}

interface ListModel {
  treatedList: DetailItem[],
  untreatedList: DetailItem[]
}

function mapList(
  taskType: string, taskStatus: string, operationRecords?: OperationRecordMobile[],
): ListModel {
  const treatedList: DetailItem[] = [];
  const untreatedList: DetailItem[] = [];

  if (operationRecords && operationRecords.length) {
    operationRecords.forEach((record) => {
      if (record.isDeleted) return;
      const { id, creatorName, creatorAvatar, handleType, status, modifyTime } = record;
      const detail: DetailItem = {
        id,
        creatorName,
        creatorAvatar,
        styleName: 'normal',
        status: handleType,
      };

      const time = modifyTime ? dayjs(modifyTime).format('YYYY-MM-DD HH:mm') : '';

      if ('CC' === taskType) {
        untreatedList.push({ ...detail, status: undefined, styleName: 'white' });
      } else {
        switch (handleType) {
        case 'HANDLE_READ':
          (status === 'COMPLETED') ? treatedList.push({
            ...detail,
            status: 'READ',
            describes: getDescribe(taskStatus, record),
            time,
          }) :
            untreatedList.push({ ...detail, status: 'UNREAD', styleName: 'white' });
          break;
        case 'HANDLE_CC':
          untreatedList.push({ ...detail, status: undefined, styleName: 'white' });
          break;
        case 'UNTREATED':
          untreatedList.push({ ...detail, styleName: 'white' });
          break;
        default:
          treatedList.push({
            ...detail,
            describes: getDescribe(taskStatus, record),
            time,
          });
          break;
        }
      }
    });
  }
  return {
    treatedList,
    untreatedList,
  };
}

function getDescribe(taskStatus: string, record: OperationRecordMobile): DescribeModel[] {
  const describe: DescribeModel = {};
  const describes: DescribeModel[] = [];

  switch (taskStatus) {
  case 'STEP_BACK':
    describe.remark = record.remark;
    describe.stepBack = record.handleDesc;
    describe.attachFiles = record?.handleTaskModel?.attachFiles;
    describes.push(describe);
    return describes;
  case 'SEND_BACK':
    describe.remark = record.remark;
    describe.sendBack = record.handleDesc;
    describe.attachFiles = record?.handleTaskModel?.attachFiles;
    describes.push(describe);
    return describes;
  }

  if (record.handleType === 'STEP_BACK') {
    describe.remark = record.remark;
    describe.stepBack = record.handleDesc;
    describe.attachFiles = record?.handleTaskModel?.attachFiles;
    describes.push(describe);
  } else if (record.handleType === 'SEND_BACK') {
    describe.remark = record.remark;
    describe.sendBack = record.handleDesc;
    describe.attachFiles = record?.handleTaskModel?.attachFiles;
    describes.push(describe);
  } else if (record.remark ||
    (record.handleTaskModel?.attachFiles && record.handleTaskModel?.attachFiles.length)) {
    describe.remark = record.remark;
    describe.attachFiles = record.handleTaskModel?.attachFiles;
    describes.push(describe);
  }

  return describes;
}
