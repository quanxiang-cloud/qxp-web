import { action, observable } from 'mobx';

import toast from '@lib/toast';

import {
  fetchAPIListAuth,
  APIAuth,
  deleteAPIAuth,
  createAPIAuth,
  updateAPIAuth,
  fetchGroupApiList,
} from './api';
class UserAndPerStore {
  @observable appID = '';
  @observable currentRole: RoleRight = { id: '' };
  @observable currentRoleID = '';
  @observable currentScopes: DeptAndUser[] = [];
  @observable apiList: APIDetailAuth[] = [];
  @observable rootPath = '';
  @observable apiAndAuthList: APIDetailAuth[] = [];
  @observable isLoadingAuth = false;
  @observable curNamespace: PolyAPI.Namespace | null = null;
  @observable apiCount = 0;

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setCurrentRole = (currentRole: RoleRight): void => {
    this.currentRole = currentRole;
    this.setCurRoleID(currentRole.id);
  };

  @action
  setCurRoleID = (currentRoleID: string): void => {
    this.currentRoleID = currentRoleID;
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
  fetchAPIFormList = (path: string, pagination: { page: number, pageSize: number}): void => {
    this.isLoadingAuth = true;
    fetchGroupApiList(path, { ...pagination, active: 1 })
      .then(async ({ list, total }) => {
        await this.setApiList(list || []);
        this.apiCount = total;
        const path: string[] = [];
        const uri: string[] = [];
        await list.forEach((api) => {
          path.push(api.accessPath);
          uri.push(api.uri);
        });
        await this.fetchAPIListAuth(path, uri);
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
          return { ...api, auth };
        });
        this.setApiAndAuthList(_apiAuthList || []);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  @action
  createAPIAuth = (auth: APIAuth): void => {
    createAPIAuth(this.appID, auth)
      .then(() => {
        this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
          if (auth.path === _api.fullPath) {
            return { ..._api, auth };
          }
          return _api;
        });
        toast.success('添加成功');
      })
      .catch((err) => toast.error(err));
  };

  @action
  updateAPIAuth = (authId: string, auth: APIAuth): void => {
    updateAPIAuth(authId, this.appID, auth)
      .then(() => toast.success('修改成功'))
      .catch((err) => toast.error(err));
  };

  @action
  deleteAPIAuth = (path: string, uri: string): void => {
    deleteAPIAuth(this.appID, { roleID: this.currentRoleID, path, uri })
      .then(() => {
        this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
          if (path === _api.fullPath) {
            return { ..._api, auth: null };
          }
          return _api;
        });
        toast.success('删除成功');
      }).catch((err) => toast.error(err));
  };

  @action
  clear = (): void => {
    this.appID = '';
    this.currentRole = { id: '' };
    this.currentRoleID = '';
    this.currentScopes = [];
    this.apiList = [];
    this.apiAndAuthList = [];
    this.rootPath = '';
  };
}

export default new UserAndPerStore();
