/* eslint-disable max-len */
import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';
import { FILL_IN } from '../constant';
import { formatApprovalTaskCard, formatFillInTaskCard } from '../util';

class TodoApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable fillIn: any[] = [];
  @observable tagType = '';
  // handle type : ALL，REVIEW, WRITE， READ， OTHER
  @observable handleType = '';
  @observable type = '';

  constructor() {
    super();
    reaction(() => this.query, this.getFetch);
  }

  @computed get query(): Record<string, any> {
    return {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
      tagType: this.tagType,
      handleType: this.handleType === 'ALL' ? '' : this.handleType,
      orderType: this.orderType,
    };
  }

  @action
  changeTagType = (tag: string): void => {
    this.tagType = tag;
    this.pageNumber = 1;
  };

  @action
  changeHandleType = (handleType: string): void => {
    this.handleType = handleType;
    this.pageNumber = 1;
  };

  @action
  getFetch = ()=>{
    switch (this.type) {
    case FILL_IN:
      this.fetchFillInAll();
      break;
    default:
      this.fetchAll();
      break;
    }
  };

  @action
  fetchAll = async () => {
    this.loading = true;
    try {
      const { dataList, total } = await formatApprovalTaskCard(this.query, 'Pending');
      this.approvals = dataList || [];
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  };

  // 填写节点任务集合
  @action
  fetchFillInAll = async () => {
    this.loading = true;
    try {
      const { dataList, total } = await formatFillInTaskCard(this.query, 'Pending');
      this.approvals = dataList || [];
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  };

  @action
  reset = () => {
    this.total = 0;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.loading = false;
    this.keyword = '';
    this.orderType = 'DESC';
    this.tagType = '';
    this.handleType = '';
  };
}

export default new TodoApprovalStore();
