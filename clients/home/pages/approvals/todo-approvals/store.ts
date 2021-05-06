import httpClient from '@lib/http-client';
import toast from '@lib/toast';
import { action, computed, observable, reaction } from 'mobx';

// type ApprovalCatalog = 'todo' | 'done' | 'cc_to_me' | 'my_applies';
type Approval = {
  id: string;
  [key: string]: any;
};

class Store {
  @observable approvals: Approval[] = [];
  @observable total = 0;
  @observable status = '';
  @observable catalog = '';
  @observable pageNumber = 1;
  @observable pageSize = 10;
  @observable loading = false;

  constructor() {
    reaction(() => this.query, this.fetchApprovals);
  }

  @computed get query(): Record<string, any> {
    return {
      keyword: '',
      page: this.pageNumber,
      size: this.pageSize,
      status: this.status,
      catalog: this.catalog,
    };
  }

  @action
  changeStatus = (status: string): void => {
    this.status = status;
    this.pageNumber = 1;
  }

  @action
  changeCatalog = (catalog: string): void => {
    this.catalog = catalog;
    this.pageNumber = 1;
  }

  @action
  paginate = (pageNumber: number, pageSize: number): void => {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }

  @action
  fetchApprovals = (): void => {
    this.loading = true;
    httpClient<{ dataList: any; total: number; }>(
      '/api/v1/flow/instance/waitReviewList',
      this.query
    ).then(({ dataList, total }) => {
      this.approvals = dataList;
      this.total = total;
      this.loading = false;
    }).catch((err) => {
      toast.error(err);
    });
  }
}

export default new Store();
