type FlowStatus = 'REVIEW' | 'IN_REVIEW' | 'SEND_BACK' | 'AGREE' | 'REFUSE' | 'CANCEL' | 'ABANDON' | 'ABEND';

type UnusualTaskItem = {
  id: string;
  instanceName: string;
  appName: string;
  flowInstanceId: string;
  applyUserName: string;
  createTime: string;
  modifyTime: string;
  instanceCreateTime: string;
  taskName: string;
  reason: string;
  instanceStatus: FlowStatus;
  status: 0 | 1 | 2;
  isDeleted: number;
  processInstanceId: string;
  taskId: string;
}
