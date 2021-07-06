type StatusValues = 'FILL_IN' | 'AGREE' | 'REFUSE' | 'SEND_BACK' | 'READ' |
   'DELIVER' | 'STEP_BACK' | 'UNTREATED' | 'IN_REVIEW' | 'AUTO_REVIEW' | 'AUTO_SKIP'
   | 'CANCEL' | 'RE_SUBMIT' | 'CC';
type NoOperationStatus = 'CC' | 'REVIEW';
type Colors = 'text-blue-600' | 'text-green-600' | 'text-red-600' | 'text-yellow-600';
type BgColors = 'bg-blue-100' | 'bg-green-100' | 'bg-red-100' | 'bg-yellow-100';
type ActiveFlowStatus = 'START' | 'END' | 'OR_APPROVAL' | 'AND_APPROVAL' | 'OR_FILLIN' | 'AND_FILLIN'; // 开始 结束 或签 会签 任填 全填
type AllStatus = StatusValues & ActiveFlowStatus;

interface OperationRecord {
  handleType: StatusValues;
  creatorAvatar: string;
  creatorName: string;
  remark?: string;
  createTime?: string;
  handleDesc?: string;
  modifyTime?: string;
  status?: 0 | 1;
}

interface FlowItem {
  id: string;
  taskType: ActiveFlowStatus | StatusValues,
  flowName: string;
  creatorName: string;
  createTime: string;
  operationRecords: OperationRecord[];
  taskName: string;
  status: AllStatus;
  remark: string;
  modifyTime: string;
  reason?: string;
}

