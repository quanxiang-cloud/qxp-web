import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';
import { getMyReviewedList } from '../api';

class DoneApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];

  constructor() {
    super();
    reaction(() => this.query, this.fetchAll);
  }

  @computed get query(): Record<string, any> {
    return {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
      orderType: this.orderType,
    };
  }

  @action
  fetchAll = async () => {
    this.loading = true;
    try {
      const { dataList = [], total } = await getMyReviewedList(this.query);
      this.approvals = dataList;
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  };
}

export default new DoneApprovalStore();
