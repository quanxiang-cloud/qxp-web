import { action, computed, observable, reaction } from 'mobx';

import { SocketData } from '@lib/push';

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
  defineFunc,
  buildFunc,
  deleteFunc,
  updateVerDesc,
  offlineVer,
  servingVer,
  deleteVer,
  registerAPI,
  getApiPath,
  getVersionInfo,
  getVersion,
  getBuildProcessStatus,
  fetchGroupList,
  bindGroup,
} from './api';
import toast from '@lib/toast';
import { getApiDoc } from '../api-documentation/api';
import { INIT_API_CONTENT } from '../api-documentation/constants';
import { faasState, FUNC_STATUS } from './constants';

const INIT_CURRENT_FUNC = {
  id: '',
  name: '',
  state: 'Unknown' as FaasProcessStatus,
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

const ENV = {
  FUNC_CLEAR_SOURCE: 'true',
  GOPROXY: 'https://goproxy.cn,direct',
  FUNC_NAME: ' HelloWorld',
};

function getBuildStatusMap(statusList: FaasBuildStatus[]): Record<string, FaasProcessStatus> {
  return statusList.reduce<Record<string, FaasProcessStatus>>((acc, _status) => {
    if (_status.children) {
      return { ...acc, ...getBuildStatusMap(_status.children), [_status.name]: _status.status };
    }

    return { ...acc, [_status.name]: _status.status };
  }, {});
}

type GroupSchema = {
  type: string;
  gid: number;
  name: string;
  describe: string
}

class FaasStore {
  @observable step = 0;
  @observable appID = '';
  @observable appDetails: AppInfo = {
    id: '',
    appName: '',
    appIcon: '',
    useStatus: 0,
    appSign: '',
  };
  @observable User: { id: string; email: string } = {
    id: '',
    email: '',
  };
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
  @observable currentFunc: FuncField = INIT_CURRENT_FUNC;
  @observable versionList: VersionField[] = [];
  @observable currentVersionFunc: VersionField | null = null;
  @observable initErr = false;
  @observable APiContent: APiContent = INIT_API_CONTENT;
  @observable isAPILoadingErr = '';
  @observable isAPILoading = false;
  @observable searchAlias = '';
  @observable apiPath = '';
  @observable buildSteps: string[] = [];
  @observable buildStatusMap: Record<string, FaasProcessStatus> = {};
  @observable versionsParams: VersionListParams = {
    state: '',
    page: 1,
    size: 10,
  };
  @observable showBindDevelopModal = false;
  @observable showBindGroupModal = false;
  @observable showJoinGroupModal = false;
  @observable userAccount = '';
  @observable optionalGroup: Group[] = [];

  constructor() {
    reaction(() => this.showBindGroupModal, this.fetchGroupList);
    reaction(() => this.versionsParams, this.fetchVersionList);
  }

  @computed get optionalGroupToSelectEnum(): {label: string, value: number}[] {
    return this.optionalGroup.map((group) => {
      return { label: group?.name || '', value: group.gid || 0 };
    });
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setGroupID = (groupID: string): void => {
    this.groupID = groupID;
  };

  // @action
  // setCurGroup = (curGroup: Group): void => {
  //   this.curGroup = curGroup;
  // };

  @action
  setOptionalGroup = (optionalGroup: Group[]): void => {
    this.optionalGroup = optionalGroup;
  };

  @action
  setUserAccount = (userAccount: string): void => {
    this.userAccount = userAccount;
  };

  @action
  setStep = (step: number): void => {
    this.step = step;
  };

  @action
  setShowBindDevelopModal = (showBindDevelopModal: boolean): void => {
    this.showBindDevelopModal = showBindDevelopModal;
  };

  @action
  setShowBindGroupModal = (showBindGroupModal: boolean): void => {
    this.showBindGroupModal = showBindGroupModal;
  };

  @action
  setShowJoinGroupModal = (showJoinGroupModal: boolean): void => {
    this.showJoinGroupModal = showJoinGroupModal;
  };

  @action
  setVersionParams = (newParam: Partial<VersionListParams>): void => {
    this.versionsParams = { ...this.versionsParams, ...newParam };
  };

  @action
  setModalType = (type: string): void => {
    this.modalType = type;
  };

  @action
  checkUserState = async (): Promise<void> => {
    this.checkUserLoading = true;
    await this.developerCheck();
    this.step === faasState.DEVELOP && await this.isGroup();
    if (this.step === faasState.GROUP) {
      await this.isDeveloperInGroup();
    }
    this.checkUserLoading = false;
  };

  @action
  developerCheck = (): Promise<void> => {
    return checkIsDeveloper().then(({ userAccount }) => {
      if (userAccount) {
        this.setUserAccount(userAccount);
        this.setStep(faasState.DEVELOP);
      }
    }).catch((err) => toast.error(err));
  };

  @action
  isGroup = (): Promise<void> => {
    return checkHasGroup({
      appID: this.appID,
    }).then((groupID) => {
      if (groupID) this.setStep(faasState.GROUP);
      this.setGroupID(groupID);
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  isDeveloperInGroup = (): Promise<void> => {
    return checkInGroup({
      groupID: this.groupID,
    }).then((isMember) => {
      if (isMember) this.setStep(faasState.INGROUP);
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  createDeveloper = (data: {account: string}): Promise<void> => {
    return createDeveloper(data).then(() => {
      this.step = faasState.DEVELOP;
      this.userAccount = data.account;
      toast.success('绑定开发者账号成功');
    }).catch((error) => {
      toast.error(error);
    }).finally(() => this.setShowBindDevelopModal(false));
  };

  @action
  fetchGroupList = (): void => {
    if (this.showBindGroupModal) {
      fetchGroupList().then((res) => {
        this.setOptionalGroup(res);
      });
    }
  };

  @action
  onSubmitGroupModal = (formData: GroupSchema): void => {
    if (formData.type === 'custom') {
      this.createGroup(formData.name, formData.describe);
      return;
    }
    this.bindGroup(formData.gid);
  };

  @action
  createGroup = (name: string, describe: string): Promise<void> => {
    return createGroup({
      name,
      describe,
      appID: this.appID,
    }).then((groupID) => {
      this.step = faasState.GROUP;
      this.setGroupID(groupID);
      this.setShowBindGroupModal(false);
      toast.success('绑定成功');
    });
  };

  @action
  bindGroup = (gid: number): void => {
    bindGroup({ gid, appID: this.appID })
      .then((groupID) => {
        this.step = faasState.GROUP;
        this.setShowBindGroupModal(false);
        this.setGroupID(groupID);
        toast.success('绑定成功');
      });
  };

  @action
  addUserToGroup = (): void => {
    addToGroup(this.groupID).then(() => {
      this.step = faasState.INGROUP;
      this.setShowJoinGroupModal(false);
    }).catch((err) => {
      this.initLoading = false;
      this.initErr = true;
      toast.error(err);
    });
  };

  @action
  fetchFuncList = (searchAlias: string, page: number, size: number): void => {
    fetchFuncList(this.groupID, {
      alias: searchAlias,
      page,
      size,
    }).then((res) => {
      const { projects } = res;
      this.funcList = projects;
    }).catch((err) => {
      toast.error(err);
      this.funcList = [];
    }).finally(() => {
      this.funcListLoading = false;
    });
  };

  @action
  fetchFuncInfo = (): Promise<void> => {
    return getFuncInfo(this.groupID, this.currentFuncID).then((res) => {
      this.currentFunc = res;
    });
  };

  @action
  mutateFuncStatus = (id: string, status: FaasProcessStatus): void => {
    this.funcList = this.funcList.map((func) => {
      if (func.id === id) {
        return {
          ...func,
          state: status,
        };
      }

      return func;
    });
  };

  @action
  createFunc = (data: creatFuncParams): void => {
    createFaasFunc(this.groupID, { ...data, tag: '1.16' }).then((res) => {
      this.currentFuncID = res.id;
      this.currentFunc = { ...res, ...data, state: 'True' };
      this.funcList = [this.currentFunc, ...this.funcList];
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  updateFuncDesc = (id: string, describe: string): void => {
    updateFuncDesc(this.groupID, id, { describe }).then(() => {
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
  };

  @action
  defineFunc = (id: string): void => {
    Promise.all([
      defineFunc(this.groupID, id),
      fetch('/_otp').then((response) => response.json()),
    ]).then(([{ url }, { token }]) => {
      window.open(`${url}?token=${token}`, '_blank');
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  buildFunc = (buildData: { version: string, describe: string }): void => {
    buildFunc(this.groupID, { ...buildData, env: ENV, projectID: this.currentFuncID }).then(() => {
      this.modalType = '';
    }).catch((err) => {
      toast.error(err);
    });
  };

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
  };

  @action
  fetchVersionList = (): void => {
    getFuncVersionList(this.groupID, this.currentFuncID).then((res) => {
      const { data = [] } = res;
      this.versionList = data;
    }).catch((err) => {
      toast.error(err);
      this.funcList = [];
    }).finally(() => {
      this.funcListLoading = false;
    });
  };

  @action
  updateVerDesc = (describe: string): void => {
    updateVerDesc(this.groupID, this.currentVersionFunc?.id || '', this.buildID, { describe }).then(() => {
      this.versionList = this.versionList.map((_version) => {
        if (_version.id === this.currentVersionFunc?.id) {
          this.currentVersionFunc = { ..._version, describe };
          return { ..._version, description: describe };
        }
        return _version;
      });
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  offlineVer = (id: string): void => {
    offlineVer(this.groupID, this.currentFuncID, id).then(() => {
      this.setVersionParams({});
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  servingVer = (id: string): void => {
    servingVer(this.groupID, this.currentFuncID, id).then(() => {
      this.setVersionParams({});
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  deleteVer = (id: string): void => {
    deleteVer(this.groupID, this.currentFuncID, id).then(() => {
      this.versionList = this.versionList.filter((version) => id !== version.id);
      toast.success('删除成功');
    }).catch((err) => {
      toast.error(err);
    });
  };

  getVersion = (): void => {
    getVersion(this.groupID, this.currentFuncID, this.buildID).then((res) => {
      const { build } = res;
      this.currentVersionFunc = build;
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  registerAPI = (buildID: string): void => {
    registerAPI(this.groupID, { buildID }).then(() => {
      toast.success('注册文档成功');
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  getApiPath = (): void => {
    this.isAPILoading = true;
    this.isAPILoadingErr = '';
    getApiPath(this.groupID, this.currentFuncID, this.buildID).then((res) => {
      this.apiPath = res.path;
    }).catch((err) => {
      toast.error(err);
      this.isAPILoadingErr = err;
    }).finally(() => this.isAPILoading = false);
  };

  @action
  fetchApiDoc = (path: string): void => {
    this.isAPILoadingErr = '';
    getApiDoc(path, {
      docType: 'curl',
      titleFirst: false,
    }).then((res: QueryDocRes) => {
      const { doc } = res || {};
      this.APiContent = doc;
      this.isAPILoading = false;
    }).catch((err) => {
      toast.error(err);
      this.APiContent = INIT_API_CONTENT;
      this.isAPILoadingErr = err.message;
      this.isAPILoading = false;
    });
  };

  //   {
  //     "content": {
  //         "key": "dc61wj41",
  //         "topic": "build"
  //     },
  //     "type": "faas"
  // }
  @action
  versionStateChangeListener = async (buildID: string, socket: SocketData, type: 'status',
  ): Promise<void> => {
    const { key, topic }: FaasSoketData = socket?.content || {};
    console.log(buildID, key, topic );
    // debugger;
    if (key !== buildID || topic !== 'builder') {
      return;
    }

    const versionInfo = await getVersionInfo(this.groupID, this.currentFuncID, buildID);
    // if (!['Unknown', ''].includes(versionInfo.build.status)) {

    if (versionInfo.status < FUNC_STATUS.StatusFailed) {
      this.versionList = this.versionList.map((version) => {
        if (version.id === buildID) {
          return {
            ...version,
            [type]: versionInfo[type],
            completionTime: versionInfo.updatedAt,
          };
        }

        return version;
      });

      if (this.currentVersionFunc?.id === buildID) {
        this.currentVersionFunc = {
          ...this.currentVersionFunc,
          [type]: versionInfo[type],
          completionTime: versionInfo.updatedAt,
        };
      }

      toast.success('操作成功！');
    }
  };

  @action
  updateBuildStatus = (): void => {
    getBuildProcessStatus(this.groupID, this.currentFuncID, this.buildID).then((status) => {
      this.buildStatusMap = getBuildStatusMap(status.events);
    });
  };

  @action
  clear = (): void => {
    this.isAPILoading = false;
    this.isAPILoadingErr = '';
    this.initErr = false;
    this.step = faasState.NOT_INITIAL;
  };
}

export default new FaasStore();
