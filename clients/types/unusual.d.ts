type FlowStatus = 'SUBMIT' | 'RE_SUBMIT' | 'CANCEL' | 'AGREE' | 'REFUSE' | 'FILL_IN' | 'DELIVER' |
  'STEP_BACK' | 'SEND_BACK' | 'CC' | 'ADD_SIGN' | 'READ' | 'REVIEW' | 'IN_REVIEW'
  | 'AUTO_REVIEW' | 'AUTO_SKIP' | 'ABANDON';

type UnusualTaskItem = {
  id: string;
  instanceName: string;
  appName: string;
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
