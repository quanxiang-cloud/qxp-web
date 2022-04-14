import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { PathType } from '@portal/modules/poly-api/effects/api/namespace';

import {
  createAPIAuth,
  deleteAPIAuth,
  fetchAPIListAuth,
  fetchGroupApiList,
  fetchRolePerson,
  getUserDetail,
  updateAPIAuth,
  updatePerUser,
} from '../api';
import { Role, SCOPE } from '../constants';
import { getAddAndRemovePerson } from '../utils';

class RoleAssociateStore {
  @observable scopeType = SCOPE.STAFF;
  @observable appID = '';
  @observable currentScopes: DeptAndUser[] = [];
  @observable currentRoleID = '';
  @observable curRoleType = Role.CUSTOMIZE;
  @observable isLoadingScope = false;
  @observable selectUser: string[] = [];
  @observable UserDetailList: UserDetail[] = [];
  @observable showPickerModal = false;
  @observable isLoadingAuth = false;
  @observable scopeDeptList: UserOrDept[] = [];
  @observable apiList: APIDetailAuth[] = [];
  @observable apiAndAuthList: APIDetailAuth[] = [];
  @observable apiCount = 0;
  @observable curNamespace: PolyAPI.Namespace | null = null;
  @observable rootPath = '';
  @observable modelType: PathType = 'inner.form';

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
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
  setShowPickerModal = (showPickerModal: boolean): void => {
    this.showPickerModal = showPickerModal;
  };

  @action
  setScopeDeptList = (scopeDeptList: UserOrDept[]): void => {
    this.scopeDeptList = scopeDeptList;
  };

  @action
  setScopeType = (scopeType: number): void => {
    this.scopeType = scopeType;
  };

  @action
  setSelectUser = (selectUser: string[]): void => {
    this.selectUser = selectUser;
  };

  @action
  setCurrentScopes = (currentScopes: DeptAndUser[]): void => {
    this.currentScopes = currentScopes;
  };

  @action
  fetchUserDetailList = (users: UserOrDept[]): void => {
    this.isLoadingScope = true;
    const usersIDList = Array.from(users, ({ id }) => id);
    const query = `
    {query(ids:${JSON.stringify(usersIDList)}){users{id,email,phone,name,departments{id,name}}}}
    `;
    getUserDetail<{ users: UserDetail[] }>({ query }).then((res) => {
      this.UserDetailList = res?.users;
    }).catch((err: any) => {
      toast.error(err);
    }).finally(() => this.isLoadingScope = false);
  };

  @action
  fetchRolePerson = (appID: string, roleID: string): void => {
    if (!appID || !roleID) {
      this.currentScopes = [];
      return;
    }
    fetchRolePerson(appID, roleID)
      .then((res) => this.setCurrentScopes(res.list))
      .catch((err) => toast.error(err));
  };

  @action
  deletePerGroupUser = (ids: string[]): void => {
    const newScopes = this.currentScopes?.filter((scope) => !ids.includes(scope.id));
    this.currentScopes = newScopes;
    this.updatePerUser({ add: [], removes: ids });
  };

  @action
  batchUpdatePerUser = (
    deptList: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[],
  ): Promise<void> => {
    const { newScopes, addAndRemoveScope } = getAddAndRemovePerson(this.currentScopes, deptList, employees);
    this.setCurrentScopes(newScopes);
    return this.updatePerUser(addAndRemoveScope);
  };

  @action
  updatePerUser = (
    addAndRemoveList: { add: DeptAndUser[], removes: string[] },
  ): Promise<void> => {
    return updatePerUser(this.appID, this.currentRoleID, addAndRemoveList)
      .then(() => toast.success('修改成功'))
      .catch(() => toast.error('修改失败'))
      .finally(() => this.setShowPickerModal(false));
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
  updateAPIAuth = (authId: string, auth: APIAuth): void => {
    updateAPIAuth(authId, this.appID, auth)
      .then(() => toast.success('修改成功'))
      .catch((err) => toast.error(err));
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
    this.currentScopes = [];
    this.currentRoleID = '';
    this.scopeType = SCOPE.STAFF;
    this.curRoleType = Role.CUSTOMIZE;
    this.UserDetailList = [];
    this.scopeDeptList = [];
    this.apiList = [];
    this.apiAndAuthList = [];
    this.apiCount = 0;
    this.curNamespace = null;
    this.rootPath = '';
    this.modelType = 'inner.form';
  };
}

export default new RoleAssociateStore();
