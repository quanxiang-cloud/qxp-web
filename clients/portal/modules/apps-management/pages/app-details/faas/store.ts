import { action, observable } from 'mobx';

import {
  checkHasGroup,
  checkInGroup,
  checkIsDeveloper,
  createGroup,
  createDeveloper,
  addToGroup,
  fetchFuncList,
  createFaasFunc,
} from './api';
import toast from '@lib/toast';
import TimerSelector from '@portal/modules/work-flow/content/editor/forms/intermidiate/components/basic-config/timer-selector';

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
  @observable funcListLoading = true;
  @observable modalType = '';
  @observable buildIsError = true;
  @observable checkUserLoading = true;
  @observable apiIsError = false;
  @observable groupID = '';
  @observable funcList: FuncField[] = [];
  @observable count = 0;
  @observable currentFuncID = '';

  @action
  setModalType = (type: string): void => {
    this.modalType = type;
  }

  @action
  isaDeveloper = (): Promise<void>=> {
    return checkIsDeveloper().then((res) => {
      this.isDeveloper = res.isDeveloper;
    }).catch((err) => toast.error(err));
  }

  @action
  isGroup = (): Promise<void> => {
    return checkHasGroup({
      group: this.appDetails.appSign,
      appID: this.appDetails.id,
    }).then((res) => {
      this.hasGroup = Boolean(res.groupID);
      this.groupID = res.groupID;
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  isDeveloperInGroup = (): Promise<void> => {
    return checkInGroup({
      group: this.appDetails.appSign,
    }).then((res) =>{
      this.developerInGroup = res.isMember;
    },
    ).catch((err) => {
      toast.error(err);
    });
  }

  @action
  checkUserSate = async (): Promise<void>=> {
    this.checkUserLoading = true;
    await this.isaDeveloper();
    await this.isGroup();
    if (this.hasGroup && this.isDeveloper) await this.isDeveloperInGroup();
    this.checkUserLoading = false;
  }

  @action
  createDeveloper = (email: string) => {
    return createDeveloper({
      email,
    }).then(() => {
      const intervalBox = setInterval(async () => {
        await this.isaDeveloper();
        if (this.isDeveloper) {
          clearInterval(intervalBox);
        }
      }, 5000);
    }).catch((err) => {
      toast.error(err);
    });
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
  addUserToGroup = () => {
    addToGroup(this.groupID, { memberID: this.User.id }).then((res) => {
      this.developerInGroup = true;
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  initFaas = async (email: string): Promise<void> => {
    if (!this.isDeveloper) {
      await this.createDeveloper(email);
    }

    if (!this.hasGroup && this.isDeveloper) {
      console.log(11);
      await this.createGroup();
    }

    if (!this.developerInGroup && this.isDeveloper && this.hasGroup) {
      await this.addUserToGroup();
    }
  }

  @action
  fetchDataList = (): void => {
    fetchFuncList(this.groupID, {
      appID: this.appDetails.id,
      size: 20,
      page: 1,
    }).then((res) => {
      const { count, projects } = res;
      this.count = count;
      this.funcList = projects;
      // todo update funcList

      console.log(res);
      // this.funcList = [];
    }).catch((err) => {
      toast.error(err);
      this.funcList = [];
    }).finally(() => {
      this.funcListLoading = false;
    });
  }

  @action
createFunc = (data: any) => {
  createFaasFunc(this.groupID, data).then((res) => {
    this.currentFuncID = res.id;
    this.fetchDataList();
  }).catch((err) => {
    console.log(err);
  });
}
}

export default new FaasStore();
