import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';
import { FILL_IN } from '../constant';
import { formatApprovalTaskCard, formatFillInTaskCard } from '../util';

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
      // const { dataList = [], total } = await getAllTaskList(this.query);
      const { dataList = [], total } = await formatApprovalTaskCard(this.query, 'all');
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
      // const { list, total } = await getMyApplyFillInList('ALL_PAGE', {
      //   page: this.query.page,
      //   limit: this.query.size,
      // });
      const { dataList = [], total } = await formatFillInTaskCard(this.query, 'all');

      // filter item without id
      this.approvals = dataList.filter((item: ApprovalTask) => item.id);
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  };
}

export default new AllApprovalStore();
