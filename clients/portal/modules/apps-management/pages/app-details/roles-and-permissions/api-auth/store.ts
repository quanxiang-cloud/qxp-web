import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { PathType } from '@portal/modules/poly-api/effects/api/namespace';

import {
  createAPIAuth,
  deleteAPIAuth,
  fetchApiAuthDetails,
  fetchAPIListAuth,
  fetchGroupApiList,
  updateAPIAuth,
} from '../api';
import { Role } from '../constants';

class APIAuthStore {
  @observable appID = '';
  @observable currentRoleID = '';
  @observable rootPath = '';
  @observable curAPI: APIDetailAuth | undefined = undefined;
  @observable curAuth: APIAuth | undefined = undefined;
  @observable modelType: PathType = 'inner.form';
  @observable curRoleType = Role.CUSTOMIZE;
  @observable isLoadingAuth = false;
  @observable apiList: APIDetailAuth[] = [];
  @observable apiAndAuthList: APIDetailAuth[] = [];
  @observable apiCount = 0;
  @observable curNamespace: PolyAPI.Namespace | null = null;
  @observable showRoleDetailsModal = false;
  @observable isLoadingAuthDetails = false;

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setCurAuth = (curAuth: APIAuth): void => {
    this.curAuth = curAuth;
  };

  @action
  setRole = (role: RoleRight): void => {
    this.currentRoleID = role.id;
    this.curRoleType = role?.type || Role.CUSTOMIZE;
  };

  @action
  setModelType = (modelType: PathType): void => {
    this.modelType = modelType;
  };

  @action
  setCurAPI = (api: APIDetailAuth): void => {
    this.curAPI = api;
  };

  @action
  setCurNamespace = (curNamespace: PolyAPI.Namespace | null): void => {
    this.curNamespace = curNamespace;
  };

  @action
  setApiList = (_apiList: APIDetailAuth[]): void => {
    this.apiList = _apiList;
  };

  @action
  setApiAndAuthList = (apiAndAuthList: APIDetailAuth[]): void => {
    this.apiAndAuthList = apiAndAuthList;
  };

  @action
  setRootPath = (_rootPath: string): void => {
    this.rootPath = _rootPath;
  };

  @action
  setCurrentRoleID = (currentRoleID: string): void => {
    this.currentRoleID = currentRoleID;
  };

  @action
  fetchAPIFormList = (path: string, pagination: { page: number, pageSize: number }): void => {
    this.isLoadingAuth = true;
    fetchGroupApiList(path, { ...pagination, active: 1 })
      .then(async ({ list, total }) => {
        await this.setApiList(list || []);
        this.apiCount = total;
        const path: string[] = [];
        const uri: string[] = [];
        if (list.length) {
          await list.forEach((api) => {
            path.push(api.accessPath);
            uri.push(api.uri);
          });
          await this.fetchAPIListAuth(path, uri);
        } else {
          this.setApiAndAuthList([]);
        }
      })
      .catch((err) => toast.error(err))
      .finally(() => this.isLoadingAuth = false);
  };

  @action
  fetchAPIListAuth = (paths: string[], uris: string[]): Promise<void> => {
    return fetchAPIListAuth(this.appID, { roleID: this.currentRoleID, paths, uris })
      .then((authList: Record<string, APIAuth>) => {
        const _apiAuthList = this.apiList.map((api) => {
          const auth = authList[api.accessPath] || null;
          return { ...api, auth, isLoading: false };
        });
        this.setApiAndAuthList(_apiAuthList);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  @action
  createAPIAuth = (auth: APIAuth): void => {
    this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
      if (auth.path === _api.accessPath) {
        return { ..._api, isChanging: true };
      }
      return _api;
    });
    createAPIAuth(this.appID, auth)
      .then(() => {
        this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
          if (auth.path === _api.accessPath) {
            return { ..._api, auth, isChanging: false };
          }
          return _api;
        });
        toast.success('添加成功');
      })
      .catch((err) => toast.error(err));
  };

  @action
  fetchApiAuthDetails = (): void => {
    this.isLoadingAuthDetails = true;
    fetchApiAuthDetails(this.appID || '', {
      roleID: this.currentRoleID,
      path: this.curAPI?.accessPath || '',
      uri: this.curAPI?.uri || '',
    })
      .then(this.setCurAuth)
      .catch((err) => toast.error(err))
      .finally(() => this.isLoadingAuthDetails = false);
  };

  @action
  updateAPIAuth = (auth: APIAuth): void => {
    updateAPIAuth(auth?.id || '', this.appID, auth)
      .then(() => toast.success('修改成功'))
      .catch((err) => toast.error(err))
      .finally(() => this.curAuth = undefined);
  };

  @action
  deleteAPIAuth = (path: string, uri: string): void => {
    this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
      if (path === _api.accessPath) {
        return { ..._api, isChanging: true };
      }
      return _api;
    });
    deleteAPIAuth(this.appID, { roleID: this.currentRoleID, path, uri })
      .then(() => {
        this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
          if (path === _api.accessPath) {
            return { ..._api, auth: null, isChanging: false };
          }
          return _api;
        });
        toast.success('删除成功');
      }).catch((err) => toast.error(err));
  };

  @action
  clear = (): void => {
    this.appID = '';
    this.currentRoleID = '';
    this.curRoleType = Role.CUSTOMIZE;
    this.apiList = [];
    this.apiAndAuthList = [];
    this.apiCount = 0;
    this.curNamespace = null;
    this.rootPath = '';
    this.modelType = 'inner.form';
  };
}

export default new APIAuthStore();
