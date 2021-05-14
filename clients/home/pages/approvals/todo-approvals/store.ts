import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';
import { getWaitReviewList } from '../api';

class TodoApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable tagType = '';
  // handle type : ALL，REVIEW, WRITE， READ， OTHER
  @observable handleType = '';

  constructor() {
    super();
    reaction(() => this.query, this.fetchAll);
  }

  @computed get query(): Record<string, any> {
    return {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
      tagType: this.tagType,
      handleType: this.handleType === 'ALL' ? '' : this.handleType,
    };
  }

  @action
  changeTagType = (tag: string): void => {
    this.tagType = tag;
    this.pageNumber = 1;
  }

  @action
  changeHandleType = (handleType: string): void => {
    this.handleType = handleType;
    this.pageNumber = 1;
  }

  @action
  fetchAll = async () => {
    this.loading = true;
    try {
      const { dataList = [], total } = await getWaitReviewList(this.query);
      this.approvals = dataList;
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  }

  @action
  reset = () => {
    this.total = 0;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.loading = false;
    this.keyword = '';
    this.orderType = '';
    this.tagType = '';
    this.handleType = '';
  }
}

export default new TodoApprovalStore();
