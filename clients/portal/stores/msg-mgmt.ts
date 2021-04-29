// message mgmt store
import { observable, action } from 'mobx';

class MsgMgmt {
  @observable.shallow
  paging = {
    limit: 1,
    page: 1,
  }

  @observable
  searchWord = '';

  @action
  setPaging = (params: Record<string, unknown>) => {
    Object.assign(this.paging, params);
  }

  @action
  setSearch = (word: string) => {
    this.searchWord = word;
  }
}

export default new MsgMgmt();
