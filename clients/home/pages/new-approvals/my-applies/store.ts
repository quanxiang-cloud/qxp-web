import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';
import day from 'dayjs';
import Store from '../base-store';
import { FILL_IN } from '../constant';
import { formatApprovalTaskCard, formatFillInTaskCard, updateFinish } from '../util';

// default query recent 7 days
const beginDay = day().subtract(7, 'day').format('YYYY-MM-DD');
const endDay = day().format('YYYY-MM-DD');

class MyAppliedApprovalStore extends Store {
  @observable approvals: ApprovalTask[] = [];
  @observable fillIn: any[] = [];
  @observable status = '';
  @observable beginDate = beginDay;
  @observable endDate = endDay;
  @observable readableDate = 'customized:recent_seven_days';
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
      status: this.status === 'ALL' ? '' : this.status,
      beginDate: this.beginDate,
      endDate: this.endDate,
      orderType: this.orderType,
    };
  }

  @action
  changeStatus = (status: string): void => {
    this.status = status;
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
      const { dataList = [], total } = await formatApprovalTaskCard(this.query, 'myApply');
      await updateFinish(dataList);
      this.approvals = dataList.filter((item: ApprovalTask) => item.id); // filter item without id
      this.total = total - (dataList.length - this.approvals.length);
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
      const { dataList = [], total } = await formatFillInTaskCard(this.query, 'myApply');
      await updateFinish(dataList);
      this.approvals = dataList.filter((item: ApprovalTask) => item.id); // filter item without id
      this.total = total;
      this.loading = false;
    } catch (err) {
      toast.error(err);
    }
  };

  @action
  changeDate = ({ start, end, readableCode }: { start: string, end: string, readableCode: string }) => {
    this.beginDate = start;
    this.endDate = end;
    this.readableDate = readableCode;
  };

  @action
  reset = () => {
    this.total = 0;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.loading = false;
    this.keyword = '';
    this.orderType = 'DESC';
    this.status = '';
    this.beginDate = beginDay;
    this.endDate = endDay;
    this.readableDate = 'customized:recent_seven_days';
  };
}

export default new MyAppliedApprovalStore();
