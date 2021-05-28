import { observable, action, computed } from 'mobx';
export interface LogPage {
  pageSize?: number,
  current?: number,
  total?: number
}
export interface LogRequestInfo {
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean
}
class AuditLog {
  @observable.shallow
  paging = {
    size: 10,
    page: 1,
  }

  @observable
  userName = ''

  @observable
  operationTimeBegin = Math.round(new Date('2021-3-1').getTime() / 1000);

  @observable
  operationTimeEnd = Math.round(new Date().getTime() / 1000);

  @observable
  logPageInfo:LogPage = {
    pageSize: 10,
    current: 1,
    total: 0,
  }

  @observable
  data:any = []

  @observable
  logRequestInfo:LogRequestInfo = {
    isLoading: false,
    isError: false,
    isFetching: false,
  }

  @computed get logPageParams() {
    const { pageSize, current: currentPage } = this.logPageInfo;
    return {
      size: pageSize,
      page: currentPage,
      operationTimeBegin: this.operationTimeBegin,
      operationTimeEnd: this.operationTimeEnd,
    };
  }

  @action
  setLogPageInfo = (pageInfo:LogPage) => {
    this.logPageInfo = pageInfo;
  }

  @action
  setUserName = (userName:string) => {
    this.userName = userName;
  }

  @action
  setOperationTimeBegin = (timeStamp: number) => {
    this.operationTimeBegin = timeStamp;
  }

  @action
  setOperationTimeEnd = (timeStamp: number) => {
    this.operationTimeEnd = timeStamp;
  }

  @action
  setAuditLogData = (data:any) => {
    this.data = data;
  }

  @action
  setLogRequestInfo = (logRequestInfo:LogRequestInfo) => {
    this.logRequestInfo = logRequestInfo;
  }

  @action
  setLogPaging = (params: Record<string, unknown>) => {
    Object.assign(this.paging, params);
  }
}

export default new AuditLog();
