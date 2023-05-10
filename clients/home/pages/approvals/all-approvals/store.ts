import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';
import { getAllTaskList, getMyApplyFillInList } from '../api';
import { FILL_IN } from '../constant';

class AllApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable fillIn: any[] = [];
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
      orderType: this.orderType,
    };
  }

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
      const { dataList = [], total } = await getAllTaskList(this.query);
      this.approvals = dataList;
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
      const { list, total } = await getMyApplyFillInList('ALL_PAGE', {
        page: this.query.page,
        limit: this.query.size,
      });
      // filter item without id
      this.approvals = list.filter((item: ApprovalTask) => item.id);
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  };
}

export default new AllApprovalStore();
