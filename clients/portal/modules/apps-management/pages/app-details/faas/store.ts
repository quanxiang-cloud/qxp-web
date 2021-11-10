import { action, observable } from 'mobx';

import { FuncListParams } from 'clients/types/faas';
import {
  checkHasGroup,
  checkInGroup,
  checkIsDeveloper,
  createGroup,
  createDeveloper,
  addToGroup,
} from './api';
import toast from '@lib/toast';

class FaasStore {
  @observable appDetails: AppInfo = {
    id: '',
    appName: '',
    appIcon: '',
    useStatus: 0,
    appSign: '',
  }
  @observable User: {id: string; email: string} = {
    id: '',
    email: '',
  };
  @observable hasGroup = false;
  @observable isDeveloper = false;
  @observable developerInGroup = false;
  @observable initLoading = false;
  @observable funcListLoading = false;
  @observable modalType = '';
  @observable buildIsError = true;
  @observable apiIsError = false;
  @observable groupID = '';
  @observable funcList = [{
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
  isGroup = (): void => {
    checkHasGroup({
      group: this.appDetails.appSign,
      appID: this.appDetails.id,
    }).then((res) => {
      this.hasGroup = Boolean(res.groupID);
      this.groupID = res.groupID;
      if (this.hasGroup && this.isDeveloper) {
        this.isDeveloperInGroup();
      }
    });
  }

  @action
  isaDeveloper = (): void => {
    checkIsDeveloper().then((res) => {
      this.isDeveloper = res.isDeveloper;
      this.isGroup();
    },
    ).catch((err) => toast.error(err));
  }

  @action
  isDeveloperInGroup = (): void => {
    checkInGroup({
      group: this.appDetails.appSign,
    }).then((res) =>{
      this.developerInGroup = res.isMember;
    },
    ).catch((err) => toast.error(err));
  }

  @action
  createGroup = () => {
    return createGroup({
      group: this.appDetails.appSign,
      appID: this.appDetails.id,
    }).then((res) => {
      this.hasGroup = true;
      this.groupID = res.id;
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  createDeveloper = (email: string) => {
    createDeveloper({
      email,
    }).then(() => {
      this.isDeveloper = true;
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  addUserToGroup = () => {
    addToGroup(this.groupID, { memberID: this.User.id }).then((res) => {
      console.log(res);
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  initFaas = async (email: string): Promise<void> => {
    if (!this.isDeveloper) {
      await this.createDeveloper(email);
    }
    if (!this.hasGroup) {
      await this.createGroup();
    }
    if (!this.developerInGroup) {
      await this.addUserToGroup();
    }
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
