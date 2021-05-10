import { action, computed, observable } from 'mobx';

export default class BaseStore {
  @observable approvals: ApprovalTask[] = [];
  @observable total = 0;
  @observable pageNumber = 1;
  @observable pageSize = 10;
  @observable loading = false;
  @observable keyword = '';

  // constructor() {
  //   reaction(() => this.query, this.fetchApprovals);
  // }

  @computed get query(): Record<string, any> {
    return {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
    };
  }

  @action
  paginate = (pageNumber: number, pageSize: number): void => {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }

  @action
  changeKeyword = (word: string) => {
    this.keyword = word;
  }
}
