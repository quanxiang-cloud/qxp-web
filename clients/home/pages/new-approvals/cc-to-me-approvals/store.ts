import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';

class TodoApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable status = -1; // 0 (未读) | 1 (已读)

  constructor() {
    super();
    reaction(() => this.query, this.fetchAll);
  }

  @computed get query(): Record<string, any> {
    const params = {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
      orderType: this.orderType,
    };
    if (this.status !== -1) {
      Object.assign(params, { status: this.status });
    }

    return params;
  }

  @action
  changeStatus = (status: number): void => {
    this.status = status;
  };

  @action
  fetchAll = async (): Promise<void> => {
    // this.loading = true;
    try {
      // const { dataList = [], total } = await getCCToMeList(this.query);
      // this.approvals = dataList;
      // this.total = total;
      // this.loading = false;
      this.approvals = [];
    } catch (err) {
      toast.error(err);
    }
  };

  // 填写节点任务集合
  @action
  fetchFillInAll = async () => {
    // this.loading = true;
    try {
      // const { list, total } = await getMyApplyFillInList('CC_PAGE', this.query);
      // // filter item without id
      // this.approvals = list.filter((item: ApprovalTask) => item.id);
      // this.total = total;
      // this.loading = false;
      this.approvals = [];
    } catch (err) {
      toast.error(err);
    }
  };

  @action
  reset = (): void => {
    this.total = 0;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.loading = false;
    this.keyword = '';
    this.orderType = 'DESC';
    this.status = -1;
  };
}

export default new TodoApprovalStore();
