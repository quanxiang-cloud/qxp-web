import { action, observable, reaction } from 'mobx';

import { SocketData } from '@lib/push';

import {
  fetchFuncList,
  createFaasFunc,
  getFuncInfo,
  updateFuncDesc,
  getFuncVersionList,
  buildFunc,
  deleteFunc,
  updateVerDesc,
  offlineVer,
  servingVer,
  deleteVer,
  registerAPI,
  getVersionInfo,
} from '../api';
import toast from '@lib/toast';
import { INIT_API_CONTENT } from '../../api-documentation/constants';
import { API_DOC_STATE, FUNC_STATUS } from '../constants';
import { getDirectoryPath } from '@lib/api-collection/utils';

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

class FaasStore {
  @observable appID = '';
  @observable groupID = '';
  @observable funcListLoading = true;
  @observable versionListLoading = true;
  @observable modalType = '';
  @observable currentFuncID = '';
  @observable buildID = '';
  @observable currentFunc: FuncField = INIT_CURRENT_FUNC;
  @observable currentBuild: VersionField | null = null;
  @observable funcList: FuncField[] = [];
  @observable versionList: VersionField[] = [];
  @observable APiContent: APiContent = INIT_API_CONTENT;
  @observable isAPILoading = false;
  @observable searchAlias = '';
  @observable apiPath = '';
  @observable buildSteps: string[] = [];
  @observable versionsParams: VersionListParams = {
    state: '',
    page: 1,
    size: 10,
  };
  @observable userAccount = '';

  constructor() {
    reaction(() => this.groupID, () => this.fetchFuncList('', 1, 10));
    reaction(() => this.versionsParams, this.fetchVersionList);
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setGroupID = (groupID: string): void => {
    this.groupID = groupID;
  };

  @action
  setUserAccount = (userAccount: string): void => {
    this.userAccount = userAccount;
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
  fetchFuncList = (searchAlias: string, page: number, size: number): void => {
    if (!this.groupID) {
      return;
    }
    this.funcListLoading = true;
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
  createFunc = (data: creatFuncParams): void => {
    createFaasFunc(this.groupID, { ...data, version: '1.16' }).then((res) => {
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
  buildFunc = (buildData: { version: string, describe: string, env: Record<string, string> }): void => {
    buildFunc(this.groupID, { ...buildData, projectID: this.currentFuncID }).then(() => {
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
    this.versionListLoading = true;
    getFuncVersionList(this.groupID, this.currentFuncID).then((res) => {
      const { data = [] } = res;
      this.versionList = data;
    }).catch((err) => {
      toast.error(err);
      this.funcList = [];
    }).finally(() => {
      this.versionListLoading = false;
    });
  };

  @action
  updateVerDesc = (describe: string): void => {
    updateVerDesc(this.groupID, this.currentBuild?.id || '', this.buildID, { describe }).then(() => {
      this.versionList = this.versionList.map((_version) => {
        if (_version.id === this.currentBuild?.id) {
          this.currentBuild = { ..._version, describe };
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
    offlineVer(this.groupID, id ).then(() => {
      this.versionList = this.versionList.map((version) => {
        if (version.id === id) {
          this.currentBuild = { ...version, status: 6 };
          return { ...version, status: 6 };
        }

        return version;
      });
      this.setVersionParams({});
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  servingVer = (id: string): void => {
    servingVer(this.groupID, { id }).then(() => {
      this.versionList = this.versionList.map((version) => {
        if (version.id === id) {
          this.currentBuild = { ...version, status: 7 };
          return { ...version, status: 7 };
        }

        return version;
      });
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
    getVersionInfo(this.groupID, this.currentFuncID, this.buildID).then((build) => {
      this.currentBuild = build;
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  registerAPI = (buildID: string): void => {
    registerAPI(this.groupID, { buildID }).then(() => {
      this.versionList = this.versionList.map((version) => {
        if (version.id === buildID) {
          this.currentBuild = { ...version, docStatus: API_DOC_STATE.REGISTERING };
          return { ...version, docStatus: API_DOC_STATE.REGISTERING };
        }

        return version;
      });
      this.setVersionParams({});
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  getApiPath = (): void => {
    this.isAPILoading = true;
    getDirectoryPath(this.appID, 'faas').then((apiPath) => {
      this.apiPath = `${apiPath}/${this.currentBuild?.name}.r`;
    }).catch((err) => {
      toast.error(err);
    }).finally(() => this.isAPILoading = false);
  };

  @action
  versionStateChangeListener = async (buildID: string, socket: SocketData, type: 'status'): Promise<void> => {
    const { key, topic }: FaasSoketData = socket?.content || {};
    if (key !== buildID) {
      return;
    }
    const versionInfo = await getVersionInfo(this.groupID, this.currentFuncID, buildID);
    if ( topic === 'builder' || topic === 'serving') {
      if (
        versionInfo.status > FUNC_STATUS.StatusBuilding &&
        versionInfo.status !== FUNC_STATUS.OnlineBuilding
      ) {
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

        if (this.currentBuild?.id === buildID) {
          this.currentBuild = {
            ...this.currentBuild,
            [type]: versionInfo[type],
            completionTime: versionInfo.updatedAt,
          };
        }
      }
    }
  };

  @action
  apiStateChangeListener = async (socket: SocketData, type: 'status', buildID?: string,
  ): Promise<void> => {
    if (!buildID) {
      return;
    }

    const { key, topic }: FaasSoketData = socket?.content || {};
    if (key !== buildID || topic !== 'register') {
      return;
    }

    const versionInfo = await getVersionInfo(this.groupID, this.currentFuncID, buildID);
    if (
      versionInfo.docStatus !== API_DOC_STATE.REGISTERING
    ) {
      this.versionList = this.versionList.map((version) => {
        if (version.id === buildID) {
          return {
            ...version,
            docStatus: versionInfo.docStatus,
          };
        }

        return version;
      });

      if (this.currentBuild?.id === buildID) {
        this.currentBuild = {
          ...this.currentBuild,
          docStatus: versionInfo.docStatus,
        };
      }
    }
  };
}

export default new FaasStore();
