import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import day from 'dayjs';
import Store from '../base-store';
import { getMyApplyList } from '../api';

// default query recent 7 days
const beginDay = day().subtract(7, 'day').format('YYYY-MM-DD');
const endDay = day().format('YYYY-MM-DD');

class MyAppliedApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable status = '';
  @observable beginDate = beginDay;
  @observable endDate = endDay;
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
      status: this.status === 'ALL' ? '' : this.status,
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
      // filter item without id
      this.approvals = dataList.filter((item: ApprovalTask) => item.id);
      this.total = total - (dataList.length - this.approvals.length);
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
  }

  @action
  reset = () => {
    this.total = 0;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.loading = false;
    this.keyword = '';
    this.orderType = '';
    this.status = '';
    this.beginDate = beginDay;
    this.endDate = endDay;
    this.readableDate = 'customized:recent_seven_days';
  }
}

export default new MyAppliedApprovalStore();
