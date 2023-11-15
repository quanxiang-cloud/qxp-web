import { EmptyProps } from '@m/qxp-ui-mobile/empty';
import { TabsPageProps } from '@m/components/tabs-page';
import { NumberString } from '@m/qxp-ui-mobile';

export type FlowType = 'APPLY_PAGE' | 'WAIT_HANDLE_PAGE' | 'HANDLED_PAGE' | 'CC_PAGE' | 'ALL_PAGE';

export interface ApprovalsTabProps {
  filterKey?: string;
  empty: EmptyProps;
  type: FlowType;
  tagType?: 'OVERTIME' | 'URGE' | 'approval' | 'fillIn' ;
  filter?: ApprovalFilter;
  onFilterClick?: () => void;
  filterShow?: boolean;
  onTabClick?: (val: string) => void;
  isApply?: boolean;
  isTodo?: boolean;
  taskType?: string;
  [key: string]: any;
}

export interface Pair {
  key?: string;
  value?: string;
  index: number;
}

export interface FlowInstanceEntity {
  appName: string;
  creatorAvatar: string;
  creatorId: string;
  creatorName: string;
  flowId: string;
  formData: any;
  formSchema: any;
  processInstanceId: string;
  name: string;
  status: string;
  id: string;
  keyFields: string[];
}

export interface Order {
  asc?: boolean;
  column?: string;
}

export interface TasksRequest {
  agent?: 0 | 1; // only see agent :1 or 0
  appId?: string;
  handleType?: 'REVIEW' | 'WRITE' | 'READ' | 'OTHER' | string;
  keyword?: string;
  orderType?: 'ASC' | 'DESC' | string;
  orders?: Order[];
  page?: number;
  size?: number;
  tagType?: 'OVERTIME' | 'URGE' | string;
}

export interface TasksResponse {
  total: number;
  dataList?: TaskOrigin[];
}

interface Node {
  taskDefKey?: string;
  taskName?: string;
}

type FlowTaskStatus = 'COMPLETED' | 'ACTIVE';

export type TaskOrigin = {
  id: string;
  name: string;
  isDeleted: number;
  flowInstanceEntity?: FlowInstanceEntity;
  nodes?: Node[];
  handled?: FlowTaskStatus;
} & FlowInstanceEntity;

export type Task = {
  id: string; // TaskId if the task aggregated
  taskId?: string;
  name: string;
  isDeleted: number;
  nodeName?: string;
  flowSummary?: string;
  flowSummaryPair?: Pair[];
  modifyTime?: string;
  startTime?: string;
  urgeNum?: number;
  dueDate?: string;
  handled?: FlowTaskStatus;
  description?: string;
} & FlowInstanceEntity;

export interface ApprovalSearch {
  listType?: string | null;
  tagType?: string | null;
}

export interface ApprovalTab extends TabsPageProps {
  isApply: boolean;
  type: FlowType;
}

// Filters
export interface ApprovalFilter {
  label: string;
  value: NumberString;
}

export interface OperatorPermission {
  custom: OperatorPermissionItem[];
  system: OperatorPermissionItem[];
}

export interface OperatorPermissionItem {
  enabled: boolean;
  changeable: boolean;
  name: string;
  text: string;
  value: string;
  reasonRequired?: boolean;
}

export interface TaskDetailModel {
  taskId: string;
  formSchema: any;
  fieldPermission: any;
  formData: any;
  operatorPermission: OperatorPermission;
  taskName: string;
  hasCancelBtn: boolean;
  hasCcHandleBtn: boolean;
  hasReadHandleBtn: boolean;
  hasResubmitBtn: boolean;
  hasUrgeBtn: boolean;
  taskDefKey: string;
}

export interface FlowInstanceFormResponse {
  flowName: string;
  canViewStatusAndMsg: boolean;
  canMsg: boolean;
  taskDetailModels: TaskDetailModel[];
  [key: string]: any;
}

export interface FlowAction {
  text: string;
  icon?: string;
  style?: string;
  key: string;
  className?: string;
  reasonRequired?: boolean;
}

export interface TaskDetail {
  custom?: FlowAction[];
  system?: FlowAction[];
  more?: FlowAction[];
  taskId: string;
  taskName: string;
  formSchema?: ISchema;
  formData?: Record<string, any>;
}

export interface ApprovalDetailTab extends TabsPageProps {
  loading: boolean;
  error: boolean;
}

export interface AttachFile {
  fileName: string;
  fileUrl: string;
}

export interface HandleTaskModel {
  attachFiles?: AttachFile[];
  handleType: string;
  handleDesc: string;
  remark: string;
}

export interface OperationRecordMobile {
  creatorAvatar: string;
  creatorName: string;
  creatorId: string;
  currentNodeType: string;
  handleDesc: string;
  handleType: string;
  id: string;
  isDeleted: number;
  modifierId: string;
  modifierName: string;
  procInstId: string;
  remark: string;
  rootProcInstId: string;
  status: string;
  stepInstanceId: string;
  taskDefKey: string;
  taskId: string;
  taskName: string;
  modifyTime: string;
  handleTaskModel?: HandleTaskModel;
}

export interface ProcessHistory {
  createTime: string;
  creatorId: string;
  handleUserIds: string;
  id: string;
  isDeleted: number;
  modifierId: string;
  modifyTime: string;
  operationRecords: OperationRecordMobile[];
  processInstanceId: string;
  status: string;
  taskDefKey: string;
  taskId: string;
  taskName: string;
  taskType: string;
  creatorName: string;
  creatorAvatar: string;
  flowName: string;
  reason: string;
}

export interface ApprovalDetailParams {
  processInstanceID: string;
  taskID: string;
  type: string;
  taskType: string;
}
