// message mgmt store
import { observable, action, computed } from 'mobx';
import { MsgSendStatus, MsgType } from '@portal/modules/system-mgmt/constants';
export interface Page {
  pageSize: number,
  current: number,
  total: number
}
export interface RequestInfo {
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean
}
class MsgMgmt {
  @observable.shallow
  paging = {
    limit: 1,
    page: 1,
  }

  @observable
  searchWord = '';

  @observable
  pageInfo:Page = {
    pageSize: 10,
    current: 1,
    total: 0,
  }

  @observable
  data:any = []

  @observable
  keyword = ''

  @observable
  requestInfo:RequestInfo = {
    isLoading: false,
    isError: false,
    isFetching: false,
  }

  @observable
  messageStatus:MsgSendStatus = MsgSendStatus.all

  @observable
  messageType:MsgType = MsgType.all

  @computed get pageParams() {
    const { pageSize, current } = this.pageInfo;
    const status = this.messageStatus;
    const sort = this.messageType;
    return {
      limit: pageSize,
      page: current,
      status: status == MsgSendStatus.all ? undefined : status,
      sort: sort == MsgType.all ? undefined : sort,
    };
  }

  @action
  setPageInfo = (pageInfo:Page) => {
    this.pageInfo = pageInfo;
  }

  @action
  setKeyword = (keyword:string) => {
    this.keyword = keyword;
  }

  @action
  setData = (data:any) => {
    this.data = data;
  }

  @action
  setRequestInfo = (requestInfo:RequestInfo) => {
    this.requestInfo = requestInfo;
  }

  @action
  setMessageType = (messageType:MsgType) => {
    this.messageType = messageType;
  }

  @action
  setMessageStatus = (messageStatus:MsgSendStatus) => {
    this.messageStatus = messageStatus;
  }

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
