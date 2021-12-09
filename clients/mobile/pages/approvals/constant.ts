import { TabsPageProps, TabTitle } from '@m/components/tabs-page';
import { ApprovalsTabProps } from '@m/pages/approvals/tab/types';
import {
  getCCToMeList,
  getMyApplyList,
  getMyReviewedList,
  getWaitReviewList,
} from '@home/pages/approvals/api';
import { EmptyProps } from '@m/qxp-ui-mobile/empty';
import { NumberString } from '@m/qxp-ui-mobile';

export interface ApprovalSearch {
  listType?: string | null;
  tagType?: string | null;
}

export interface ApprovalTab extends TabsPageProps {
  isApply: boolean;
}

export const allList: TabTitle[] = [
  { key: 'my_applies', label: '我发起的' },
  { key: 'done', label: '我已处理' },
  { key: 'cc_to_me', label: '抄送给我' },
];

export const allTags: TabTitle[] = [
  { key: '', label: '全部' },
  { key: 'OVERTIME', label: '已超时' },
  { key: 'URGE', label: '催办' },
];

const ApplyFlowsEmpty: EmptyProps = {
  title: '暂无任务',
  content: '请在「工作台 - 我的应用」内进行申请',
  image: '/dist/images/no-approval-task.svg',
};

const TodoTasksEmpty: EmptyProps = {
  title: '暂无待办任务',
  image: '/dist/images/no-approval-task.svg',
};

const todoTab: ApprovalsTabProps = {
  request: getWaitReviewList,
  empty: TodoTasksEmpty,
  type: 'WAIT_HANDLE_PAGE',
  filterKey: 'handleType',
};

export const allTabs: Record<string, ApprovalsTabProps> = {
  my_applies: {
    request: getMyApplyList,
    empty: ApplyFlowsEmpty,
    type: 'APPLY_PAGE',
    filterKey: 'status',
  },
  done: {
    request: getMyReviewedList,
    empty: ApplyFlowsEmpty,
    type: 'HANDLED_PAGE',
  },
  cc_to_me: {
    request: getCCToMeList,
    empty: ApplyFlowsEmpty,
    type: 'CC_PAGE',
    filterKey: 'status',
  },
  '': todoTab,
  OVERTIME: { ...todoTab, tagType: 'OVERTIME' },
  URGE: { ...todoTab, tagType: 'URGE' },
};

// Filters
export interface ApprovalFilter {
  text: string;
  value: NumberString;
}

export const HandleTypes: ApprovalFilter[] = [
  { text: '全部', value: '' },
  { text: '待审批', value: 'REVIEW' },
  { text: '待填写', value: 'WRITE' },
  { text: '待阅示', value: 'READ' },
  { text: '待补充', value: 'SEND_BACK' },
];

export const ApplyStatus: ApprovalFilter[] = [
  { text: '全部', value: '' },
  { text: '待补充', value: 'SEND_BACK' },
  { text: '进行中', value: 'REVIEW' },
  { text: '已拒绝', value: 'REFUSE' },
  { text: '已通过', value: 'AGREE' },
  { text: '已撤销', value: 'CANCEL' },
];

export const CCStatus: ApprovalFilter[] = [
  { text: '全部', value: '' },
  { text: '未读', value: 0 },
];
