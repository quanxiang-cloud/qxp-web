import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { getQuery } from '@lib/utils';

import {
  fetchRoles,
  updateRole,
  createRole,
  deleteRole,
  getUserDetail,
  copyRole,
  fetchRolePerson,
  updatePerUser,
  fetchAPIListAuth,
  APIAuth,
  deleteAPIAuth,
  createAPIAuth,
  updateAPIAuth,
  fetchGroupApiList,
} from './api';
import { INIT_CURRENT_RIGHTS } from './constants';
class UserAndPerStore {
  @observable appID = '';
  @observable rolesList: Roles[] = [];
  @observable currentRole: Roles = { id: '' };
  @observable currentRoleID = '';
  @observable currentScopes: DeptAndUser[] = [];
  @observable apiList: APIDetailAuth[] = [];
  @observable UserDetailList: [] = [];
  @observable rootPath = '';
  @observable apiAndAuthList: APIDetailAuth[] = [];
  @observable isLoadingScope = false;
  @observable isLoadingAuth = false;
  @observable curNamespace: PolyAPI.Namespace | null = null;

  @action
  setCurrentScopes = (currentScopes: DeptAndUser[]): void => {
    this.currentScopes = currentScopes;
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
  fetchRoles = (): void => {
    if (!this.appID) {
      return;
    }
    fetchRoles(this.appID).then(this.setRoles).catch((err) => {
      toast.error(err);
    });
  };

  @action
  setRoles = (res: { list: Roles[] }): void => {
    const { list = [] } = res || {};
    this.rolesList = list;
    const { id } = getQuery<{ id: string }>();
    if (!id) {
      this.currentRole = this.rolesList[0] || INIT_CURRENT_RIGHTS;
      this.currentRoleID = this.rolesList[0]?.id;
      return;
    }
    this.currentRole = this.rolesList.find((_role) => _role.id === id) || INIT_CURRENT_RIGHTS;
    this.currentRoleID = this.currentRole.id;
  };

  @action
  fetchRolePerson = (): void => {
    fetchRolePerson(this.appID, this.currentRoleID)
      .then((res) => {
        this.setCurrentScopes(res.list);
      })
      .catch((err) => toast.error(err));
  };

  @action
  addRole = (role: RoleCreate): Promise<void> => {
    return createRole(this.appID, role)
      .then((res: { id: string }) => {
        this.currentRole = { ...role, ...res };
        this.updateUserAndPerStore();
      })
      .catch((err) => toast.error(err));
  };

  @action
  copyRole = (rights: Roles): Promise<void> => {
    return copyRole(this.appID, {
      groupID: rights.id,
      name: rights.name,
      description: rights.description,
    }).then((res: { id: string }) => {
      this.currentRole = { ...this.currentRole, ...rights, ...res };
      this.updateUserAndPerStore();
      toast.success('复制成功！');
    });
  };

  @action
  updateRole = (rights: Roles): Promise<void | boolean> => {
    return updateRole(this.appID, rights).then(() => {
      this.rolesList = this.rolesList.map((_rights) => {
        if (rights.id === _rights.id) {
          this.currentRole = { ..._rights, ...rights };
          return { ..._rights, ...rights };
        }

        return _rights;
      });
      toast.success('修改成功！');
      return true;
    });
  };

  @action
  updateUserAndPerStore = (): void => {
    this.rolesList = [...this.rolesList, this.currentRole];
    this.currentRoleID = this.currentRole.id;
  };

  @action
  fetchUserDetailList = (usersIDList: string[]): void => {
    this.isLoadingScope = true;
    const query = `
    {query(ids:${JSON.stringify(usersIDList)}){users{id,email,phone,name,departments{id,name}}}}
    `;
    getUserDetail<{ users: [] }>({ query }).then((res: any) => {
      this.UserDetailList = res?.users;
    }).catch((err: any) => {
      toast.error(err);
    }).finally(() => this.isLoadingScope = false);
  };

  @action
  updatePerUser = (
    addAndRemoveList: { add: DeptAndUser[], removes: string[] },
  ): Promise<boolean> => {
    return updatePerUser(this.appID, this.currentRoleID, addAndRemoveList).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  };

  @action
  setRootPath = (_rootPath: string): void => {
    this.rootPath = _rootPath;
  };

  @action
  fetchAPIFormList = (path: string): void => {
    this.isLoadingAuth = true;
    fetchGroupApiList(path, { active: 1, page: 1, pageSize: -1 })
      .then(async ({ list }) => {
        await this.setApiList(list || []);
        const _path = list.map((api) => api.fullPath);
        await this.fetchAPIListAuth(_path);
      })
      .catch((err) => toast.error(err))
      .finally(() => this.isLoadingAuth = false);
  };

  @action
  fetchAPIListAuth = (paths: string[]): Promise<void> => {
    return fetchAPIListAuth(this.appID, { roleID: this.currentRoleID, paths })
      .then((authList: Record<string, APIAuth>) => {
        const _apiAuthList = this.apiList.map((api) => {
          const auth = authList[api.fullPath] || null;
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
  deleteAPIAuth = (path: string): void => {
    deleteAPIAuth(this.appID, { roleID: this.currentRoleID, path })
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
  deleteRole = (id: string): void => {
    const delAfter = this.rolesList.filter((role) => id !== role.id);
    deleteRole(this.appID, this.currentRoleID).then(() => {
      toast.success(
        `${this.currentRole.name}  权限组删除成功`,
      );
      this.rolesList = delAfter;
      this.currentRole = delAfter[0];
      this.currentRoleID = delAfter[0].id || '';
    });
  };

  @action
  clear = (): void => {
    this.appID = '';
    this.rolesList = [];
    this.currentRole = { id: '' };
    this.currentRoleID = '';
    this.currentScopes = [];
    this.currentScopes = [];
    this.apiList = [];
    this.apiAndAuthList = [];
    this.UserDetailList = [];
    this.rootPath = '';
  };
}

export default new UserAndPerStore();
