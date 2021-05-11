import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import Store from '../base-store';
import { getMyApplyList } from '../api';

class MyAppliedApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable status = '';
  @observable beginDate = '';
  @observable endDate = '';
  @observable readableDate = 'customized:recent_seven_days';

  constructor() {
    super();
    reaction(() => this.query, this.fetchAll);
  }

  @computed get query(): Record<string, any> {
    return {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
      status: this.status,
      beginDate: this.beginDate,
      endDate: this.endDate,
    };
  }

  @action
  changeStatus = (status: string): void => {
    this.status = status;
    this.pageNumber = 1;
  }

  @action
  fetchAll = async () => {
    this.loading = true;
    try {
      const { dataList = [], total } = await getMyApplyList(this.query);
      this.approvals = dataList;
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  }

  @action
  changeDate = ({ start, end, readableCode }: { start: string, end: string, readableCode: string }) => {
    this.beginDate = start;
    this.endDate = end;
    this.readableDate = readableCode;
    console.log('date range: ', readableCode)
  }
}

export default new MyAppliedApprovalStore();
