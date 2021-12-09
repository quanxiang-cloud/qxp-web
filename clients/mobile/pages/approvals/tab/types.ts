import { EmptyProps } from '@m/qxp-ui-mobile/empty';

export type FlowType = 'APPLY_PAGE' | 'WAIT_HANDLE_PAGE' | 'HANDLED_PAGE' | 'CC_PAGE' | 'ALL_PAGE';

export interface ApprovalsTabProps {
  request: (params: Record<string, any>) => Promise<TasksResponse>;
  filterKey?: string;
  empty: EmptyProps;
  type: FlowType;
  tagType?: 'OVERTIME' | 'URGE';
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

export type TaskOrigin = {
  id: string;
  name: string;
  isDeleted: number;
  flowInstanceEntity?: FlowInstanceEntity;
  nodes?: Node[];
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
  handled?: string;
  description?: string;
} & FlowInstanceEntity;
