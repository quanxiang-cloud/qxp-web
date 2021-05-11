import { action, computed, observable } from 'mobx';

export default class BaseStore {
  @observable total = 0;
  @observable pageNumber = 1;
  @observable pageSize = 10;
  @observable loading = false;
  @observable keyword = '';
  @observable orderType = '';

  @computed get query(): Record<string, any> {
    return {
      keyword: this.keyword,
      page: this.pageNumber,
      size: this.pageSize,
      orderType: this.orderType,
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

  @action
  changeOrderType = (order: string) => {
    this.orderType = order;
  }

  @action
  reset = () => {
    this.total = 0;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.loading = false;
    this.keyword = '';
    this.orderType = '';
  }
}
