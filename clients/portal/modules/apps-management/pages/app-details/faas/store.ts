import { action, observable, toJS } from 'mobx';

import {
  checkHasGroup,
  checkInGroup,
  checkIsDeveloper,
  createGroup,
  createDeveloper,
  addToGroup,
  fetchFuncList,
  createFaasFunc,
  getFuncInfo,
  updateFuncDesc,
  getFuncVersionList,
  hasCoder,
  defineFunc,
  buildFunc,
  deleteFunc,
  updateVerDesc,
  offlineVer,
  servingVer,
  deleteVer,
  creatCoder,
} from './api';
import toast from '@lib/toast';

const INIT_CURRENT_FUNC = {
  id: '',
  name: '',
  state: 'SUCCESS',
  description: '',
  creator: '',
  createdAt: 0,
  message: '',
  updatedAt: 0,
  alias: '',
  tag: '',
  language: '',
  versionNum: 0,
};

const INIT_VERSION = {
  id: '',
  state: '',
  message: '',
  creator: '',
  createAt: 0,
  updatedAt: 0,
  tag: '',
  visibility: '',
  describe: '',
};

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
  @observable currentFuncID = '';
  @observable buildID = '';
  @observable funcList: FuncField[] = [];
  @observable currentFunc: FuncField= INIT_CURRENT_FUNC;
  @observable versionList: VersionField[] = [];
  @observable currentVersionFunc: VersionField= INIT_VERSION;
  @observable funcCount = 0;
  @observable initErr = false;

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
  checkUserState = async (): Promise<void>=> {
    this.checkUserLoading = true;
    await this.isaDeveloper();
    await this.isGroup();
    if (this.hasGroup && this.isDeveloper) await this.isDeveloperInGroup();
    this.checkUserLoading = false;
  }

  @action
  createDeveloper = (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      createDeveloper({
        email,
      }).then(() => {
        const intervalBox = setInterval(async () => {
          await this.isaDeveloper();
          if (this.isDeveloper) {
            clearInterval(intervalBox);
            resolve();
          }
        }, 5000);
      }).catch((err) => {
        toast.error(err);
        this.initErr = true;
        reject(err);
      });
    });
  }

  @action
  createGroup = (): Promise<void> => {
    return createGroup({
      group: this.appDetails.appSign,
      appID: this.appDetails.id,
    }).then((res) => {
      this.hasGroup = true;
      this.groupID = res.id;
    }).catch((err) => {
      this.initErr = true;
      toast.error(err);
    });
  }

  @action
  addUserToGroup = (): void => {
    addToGroup(this.groupID, { memberID: this.User.id }).then((res) => {
      this.developerInGroup = true;
    }).catch((err) => {
      this.initErr = true;
      toast.error(err);
    });
  }

  @action
  initFaas = async (email: string): Promise<void> => {
    this.initLoading = true;
    this.initErr = false;
    console.log(1);
    if (!this.isDeveloper) {
      console.log(2);
      await this.createDeveloper(email);
    }
    console.log(3);
    if (!this.hasGroup && this.isDeveloper) {
      console.log(4);
      await this.createGroup();
    }
    console.log(5);
    if (!this.developerInGroup && this.isDeveloper && this.hasGroup) {
      console.log(6);
      await this.addUserToGroup();
    }
    this.initLoading = false;
  }

  @action
  fetchFuncList = (): void => {
    fetchFuncList(this.groupID, {
      appID: this.appDetails.id,
      size: 20,
      page: 1,
    }).then((res) => {
      const { count, projects } = res;
      this.funcCount = count;
      this.funcList = projects;
      this.currentFunc = projects[0] || INIT_VERSION;
    }).catch((err) => {
      toast.error(err);
      this.funcList = [];
    }).finally(() => {
      this.funcListLoading = false;
    });
  }

  @action
  checkIsCoder = (): void => {
    hasCoder().then((res) => {
      if (!res.hasCoder)creatCoder();
    }).catch((err) => toast.error(err));
  }

  @action
  creatCoder = () => {
    creatCoder().then((res) => {
      console.log(res);
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  createFunc = (data: any) => {
    createFaasFunc(this.groupID, data).then(async (res) => {
      this.currentFuncID = res.id;
      await this.fetchFuncInfo();
      this.funcList = [...this.funcList, this.currentFunc];
      this.checkIsCoder();
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  fetchFuncInfo = (): void => {
    getFuncInfo(this.groupID, this.currentFuncID).then((res) => {
      this.currentFunc = res.info;
    });
  }

  @action
  updateFuncDesc = (id: string, describe: string): void => {
    this.currentFuncID = id;
    updateFuncDesc(this.groupID, id, { describe }).then((res) => {
      this.funcList = this.funcList.map((_func) => {
        if (_func.id === id) {
          this.currentFunc = { ..._func, description: describe };
          return { ..._func, description: describe };
        }
        return _func;
      });
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  defineFunc = (id: string): void => {
    Promise.all([
      defineFunc(this.groupID, id),
      fetch('/_otp').then((response) => response.json()),
    ]).then(([{ url }, { token }]) => {
      window.open(`http://${url}?token=${token}`, '_blank');
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  buildFunc = (buildData: {tag: string, describe: string}): void => {
    buildFunc(this.groupID, this.currentFuncID, buildData).then((res) => {
      this.modalType = '';
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  deleteFunc = (): void => {
    deleteFunc(this.groupID, this.currentFuncID).then(() => {
      this.modalType = '';
      toast.success('函数删除成功');
      this.funcList = this.funcList.filter((func) => this.currentFuncID !== func.id);
      this.currentFuncID = '';
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  fetchVersionList = (current: number, pageSize: number): void => {
    getFuncVersionList(this.groupID, this.currentFuncID, {
      state: '',
      size: pageSize,
      page: current,
    }).then((res) => {
      const { count, Builds } = res;
      this.funcCount = count;
      this.versionList = Builds;
      this.currentVersionFunc = Builds[0] || INIT_CURRENT_FUNC;
    }).catch((err) => {
      toast.error(err);
      this.funcList = [];
    }).finally(() => {
      this.funcListLoading = false;
    });
  }

  @action
  updateVerDesc = (describe: string): void => {
    updateVerDesc(this.groupID, this.currentVersionFunc.id, this.buildID, { describe }).then((res) => {
      this.versionList = this.versionList.map((_version) => {
        if (_version.id === this.currentVersionFunc.id) {
          this.currentVersionFunc = { ..._version, describe };
          return { ..._version, description: describe };
        }
        return _version;
      });
      console.log(res);
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  offlineVer = (id: string): void => {
    offlineVer(this.groupID, this.currentFuncID, id).then(() => {
      toast.success('下线成功');
      this.versionList = this.versionList.map((_version) => {
        if (_version.id === id) {
          this.currentVersionFunc = { ..._version, visibility: '' };
          return { ..._version, visibility: '' };
        }
        return _version;
      });
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  servingVer = (id: string): void => {
    servingVer(this.groupID, this.currentFuncID, id).then(() => {
      toast.success('上线成功');
      this.versionList = this.versionList.map((_version) => {
        if (_version.id === id) {
          this.currentVersionFunc = { ..._version, visibility: 'online' };
          return { ..._version, visibility: 'online' };
        }
        return _version;
      });
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  deleteVer = (id: string): void => {
    deleteVer(this.groupID, this.currentFuncID, id).then(() => {
      this.versionList = this.versionList.filter((version) => id !== version.id);
      toast.success('删除成功');
    }).catch((err) => {
      toast.error(err);
    });
  }
}

export default new FaasStore();
