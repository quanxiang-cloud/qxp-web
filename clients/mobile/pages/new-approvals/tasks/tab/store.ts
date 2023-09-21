import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { FlowType, Task, TasksResponse, ApprovalFilter } from '@m/pages/approvals/types';
import { getFlowSummary } from '@m/lib/value-render';
import { NumberString } from '@m/qxp-ui-mobile';
import {
  getCCToMeList,
  getWaitReviewList,
} from '@home/pages/new-approvals/api';
import { formatApprovalTaskCard, formatFillInTaskCard } from '@home/pages/new-approvals/util';

type RequestType = (params: Record<string, any>, type?: string) => Promise<TasksResponse>;

export interface LoadApprovalsProps {
  pageKey: number;
  filterKey?: string;
  filter?: ApprovalFilter;
  tagType?: string;
}

const limit = 20;

function filterCheck(filterKey?: string, filterValue?: NumberString): boolean {
  return !!filterKey && (!!filterValue || typeof filterValue === 'number');
}

class ApprovalsStore {
  private readonly request: RequestType| any;
  private readonly type: FlowType | any;
  private readonly taskType?: string;

  constructor(type: FlowType | any, request: RequestType| any, taskType?: string) {
    this.type = type;
    this.request = request;
    this.taskType = taskType;
  }

  @observable list: Task[] = [];
  @observable page = 0;
  @observable finished = false;
  @observable inited = false;
  @observable readAllEnabled = false;

  @action
  loadApprovals = async (props: LoadApprovalsProps): Promise<void> => {
    const { pageKey, filterKey, filter, tagType } = props;
    const params: Record<string, any> = { page: pageKey, limit, orderType: 'DESC', size: limit };
    const filterValue = filter?.value;
    if (filterCheck(filterKey, filterValue)) {
      params[filterKey as string] = filterValue;
    }
    if (tagType) params.tagType = tagType;
    try {
      // let res;
      // if (this.taskType === FILL_IN) {
      //   res = await this.request(params, this.type);
      // } else {
      //   res = await this.request(params);
      // }
      const res = await this.request(params, this.type);

      let data = res?.dataList || res?.list || [];
      if (data && data.length > 0) {
        data = data.map((task: any) => {
          let taskResult: Task;
          if (task.flowInstanceEntity) {
            taskResult = { ...task, ...task.flowInstanceEntity, nodeName: task.name, taskId: task.id };
          } else {
          // Task aggregated
            taskResult = {
              ...task,
              nodeName: task.nodes ? task.nodes[0]?.taskName : undefined,
              taskId: undefined,
            };
          }
          const { formData, formSchema, keyFields } = taskResult;
          const summary: Array<string> = [];
          getFlowSummary(formData, formSchema, keyFields)?.forEach(((pair) => {
            if (pair.value) {
              summary.push(`${pair.key}：${pair.value}`);
            }
          }));
          taskResult.flowSummary = summary.join(' I ');
          return taskResult;
        });
      } else {
        data = [];
      }
      this.page = pageKey;
      this.finished = data.length < limit;
      data = data.filter((itm: { isDeleted: any; }) => !itm.isDeleted);

      if (this.type === 'CC_PAGE') {
        this.readAllEnabled = data?.find((itm: { handled: string; }) => itm.handled === 'ACTIVE') !== undefined;
      }
      if (pageKey < 2) {
        this.list = data;
      } else {
        this.list = this.list.concat(data);
      }
    } catch (e) {
      if (!this.inited) this.inited = true;
      toast.error(e);
      throw e;
    }
    if (!this.inited) this.inited = true;
  };

  @action
  clear = (): void => {
    this.list = [];
    this.page = 0;
    this.finished = false;
    this.inited = false;
    this.readAllEnabled = false;
  };
}

// const myApplies = new ApprovalsStore('APPLY_PAGE', getMyApplyList);
// const done = new ApprovalsStore('HANDLED_PAGE', getMyReviewedList);
// const ccToMe = new ApprovalsStore('CC_PAGE', getCCToMeList);
// const todo = new ApprovalsStore('WAIT_HANDLE_PAGE', getWaitReviewList);
// const overtime = new ApprovalsStore('WAIT_HANDLE_PAGE', getWaitReviewList);
// const urge = new ApprovalsStore('WAIT_HANDLE_PAGE', getWaitReviewList);
// // 填写
// const myAppliesFillIn = new ApprovalsStore('APPLY_PAGE', getMobileMyApplyFillInList, FILL_IN);
// const doneFillIn = new ApprovalsStore('HANDLED_PAGE', getMobileMyApplyFillInList, FILL_IN);
// const todoFillIn = new ApprovalsStore('WAIT_HANDLE_PAGE', getMobileMyApplyFillInList, FILL_IN);

const myApplies = new ApprovalsStore('myApply', formatApprovalTaskCard);
const done = new ApprovalsStore('Finish', formatApprovalTaskCard);
const todo = new ApprovalsStore('Pending', formatApprovalTaskCard);
const ccToMe = new ApprovalsStore('CC_PAGE', getCCToMeList);
const overtime = new ApprovalsStore('WAIT_HANDLE_PAGE', getWaitReviewList);
const urge = new ApprovalsStore('WAIT_HANDLE_PAGE', getWaitReviewList);
// 填写
const myAppliesFillIn = new ApprovalsStore('myApply', formatFillInTaskCard);
const doneFillIn = new ApprovalsStore('Finish', formatFillInTaskCard);
const todoFillIn = new ApprovalsStore('Pending', formatFillInTaskCard);

export const store: Record<string, ApprovalsStore> = {
  APPLY_PAGE: myApplies,
  HANDLED_PAGE: done,
  CC_PAGE: ccToMe,
  WAIT_HANDLE_PAGE: todo,
  WAIT_HANDLE_PAGE_OVERTIME: overtime,
  WAIT_HANDLE_PAGE_URGE: urge,
  FILL_IN_APPLY_PAGE: myAppliesFillIn,
  FILL_IN_HANDLED_PAGE: doneFillIn,
  FILL_IN_WAIT_HANDLE_PAGE: todoFillIn,
};
