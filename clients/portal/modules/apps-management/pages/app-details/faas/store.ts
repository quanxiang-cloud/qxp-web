import { action, observable } from 'mobx';

class FaasStore {
  @observable hasGroup = false;
  @observable developerInGroup = false;
  @observable initLoading = false;
  @observable funcListLoading = false;
  @observable modalType = '';
  @observable funcList: FuncField[] = [{
    name: 'Mock数据',
    id: 'mock',
    state: 'SUCCESS',
    description: 'Go语言',
    creator: 'miao',
    createdAt: '2021',
  }];

  @action
  setModalType = (type: string): void => {
    this.modalType = type;
  }

  @action
  isInGroup = (): void => {
    // todo judge has group ?
    this.hasGroup = false;
  }

  @action
  isDeveloperInGroup = (): void => {
    // todo judge user in Group? condition user is developer
    this.developerInGroup = false;
  }

  @action
  initFaas = (): void => {
    // todo init Faas
    this.initLoading = true;
    this.hasGroup = true;
    this.developerInGroup = true;
    this.initLoading = false;
  }

  @action
  fetchDataList = (groupID: string, params: FuncListParams): void => {
    this.funcListLoading = true;
    this.funcList = [
      {
        name: 'Mock数据1',
        id: 'mock1',
        state: 'SUCCESS',
        description: 'Go',
        creator: 'miao',
        createdAt: '2021',
      },
      {
        name: 'Mock数据2',
        id: 'mock2',
        state: 'ING',
        description: 'Go',
        creator: 'miao',
        createdAt: '2021',
      },
      {
        name: 'Mock数据3',
        id: 'mock3',
        state: 'FAILED',
        description: 'Go',
        creator: 'miao',
        createdAt: '2021',
      },
    ];
    // fetchFuncList(groupID, params).then((res) => {
    //   // todo update funcList
    //   this.funcList = [];
    // }).catch((err) => {
    //   toast.error(err);
    //   this.funcList = [];
    // }).finally(() => {
    //   this.funcListLoading = false;
    // });
  }
}

export default new FaasStore();
