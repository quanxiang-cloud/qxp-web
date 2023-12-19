import { TabTitle } from '@m/components/tabs-page';
import { EmptyProps } from '@m/qxp-ui-mobile/empty';

import { ApprovalFilter, ApprovalsTabProps } from './types';
import { APPROVAL, FILL_IN } from '@home/pages/new-approvals/constant';

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

export const todlAllTags: TabTitle[] = [
  // { key: '', label: '全部' },
  { key: APPROVAL, label: '审批' },
  { key: FILL_IN, label: '填写' },
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
  empty: TodoTasksEmpty,
  type: 'WAIT_HANDLE_PAGE',
  filterKey: 'handleType',
};

export const allTabs: Record<string, ApprovalsTabProps> = {
  my_applies: {
    empty: ApplyFlowsEmpty,
    type: 'APPLY_PAGE',
    filterKey: 'status',
  },
  done: {
    empty: ApplyFlowsEmpty,
    type: 'HANDLED_PAGE',
  },
  cc_to_me: {
    empty: ApplyFlowsEmpty,
    type: 'CC_PAGE',
    filterKey: 'status',
  },
  '': todoTab,
  OVERTIME: { ...todoTab, tagType: 'OVERTIME' },
  URGE: { ...todoTab, tagType: 'URGE' },
  approval: todoTab,
  fillIn: todoTab,
};

export const emptyFilter: ApprovalFilter = { label: '', value: '' };

export const HandleTypes: ApprovalFilter[] = [
  { label: '全部', value: '' },
  { label: '待审批', value: 'REVIEW' },
  { label: '待填写', value: 'WRITE' },
  { label: '待阅示', value: 'READ' },
  { label: '待补充', value: 'SEND_BACK' },
];

export const ApplyStatus: ApprovalFilter[] = [
  { label: '全部', value: '' },
  // { label: '待补充', value: 'SEND_BACK' },
  { label: '进行中', value: 'REVIEW' },
  { label: '已拒绝', value: 'REFUSE' },
  { label: '已通过', value: 'AGREE' },
  { label: '已撤销', value: 'CANCEL' },
];

export const FillInApplyStatus: ApprovalFilter[] = [
  { label: '全部', value: '' },
  { label: '进行中', value: 'Pending' },
  { label: '已完成', value: 'Finish' },
];

export const CCStatus: ApprovalFilter[] = [
  { label: '全部', value: '' },
  { label: '未读', value: 0 },
];

export const TitleOptions: ApprovalFilter[] = [
  { label: '待办任务', value: 'todo' },
  { label: '我的申请', value: 'apply' },
];
