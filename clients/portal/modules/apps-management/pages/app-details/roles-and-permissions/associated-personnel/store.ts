import { action, computed, observable, reaction } from 'mobx';

import toast from '@lib/toast';

import {
  fetchRoleDept,
  fetchRolePerson,
  getDepDetail,
  getUserDetail,
  updatePerUser,
} from '../api';
import { SCOPE } from '../constants';
import { getAddAndRemovePerson, getScopeQuery } from '../utils';

type ScopeDetail = UserDetail | DepDetail;

class RoleAssociateStore {
  @observable appID = '';
  @observable currentRoleID = '';
  @observable scopeType = SCOPE.STAFF;
  @observable allScopes: DeptAndUser[] = [];
  @observable someScope: DeptAndUser[] = [];
  @observable selectUser: string[] = [];
  @observable scopeDetailList: ScopeDetail[] = [];
  @observable isLoadingAll = false;
  @observable isLoadingSome = false;
  @observable showPickerModal = false;
  @observable isLoadingDetail = false;
  @observable total = 0;
  @observable deptScopes: DeptAndUser[] = [];

  constructor() {
    reaction(() => this.someScope, this.fetchScopeDetailList);
  }

  @computed get userAndDept(): { users: UserOrDept[]; deptList: UserOrDept[]; } {
    if (this.allScopes.length) {
      const users: UserOrDept[] = [];
      const deptList: UserOrDept[] = [];
      this.allScopes.forEach((scope) => {
        if (scope.type === SCOPE.STAFF) {
          users.push({
            id: scope.id,
            ownerID: scope.id,
            type: SCOPE.STAFF,
            ownerName: scope.name,
          });
        } else {
          deptList.push({
            id: scope.id,
            ownerID: scope.id,
            type: SCOPE.DEP,
            ownerName: scope.name,
          });
        }
      });
      return { users, deptList };
    }
    return { users: [], deptList: [] };
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
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
  setScopeType = (scopeType: number): void => {
    this.scopeType = scopeType;
  };

  @action
  setSelectUser = (selectUser: string[]): void => {
    this.selectUser = selectUser;
  };

  @action
  setCurrentScopes = (allScopes: DeptAndUser[]): void => {
    this.allScopes = allScopes;
  };

  @action
  fetchAllScope = (): void => {
    this.isLoadingAll = true;
    this.fetchRolePerson(SCOPE.ALL)
      .finally(() => {
        this.isLoadingAll = false;
        this.showPickerModal = true;
      });
  };

  @action
  fetchDeptScope = (): void => {
    this.isLoadingAll = true;
    this.appID && fetchRoleDept(this.appID, this.currentRoleID, { type: SCOPE.DEP })
      .then((res: any)=>{
        this.deptScopes = res?.list || [];
      })
      .finally(() => {
        this.isLoadingAll = false;
      });
  };

  @action
  fetchSomeScope = (type: number): void => {
    this.isLoadingSome = true;
    this.fetchRolePerson(type)
      .finally(() => {
        this.isLoadingSome = false;
      });
  };

  @action
  fetchRolePerson = async (type: number): Promise<void> => {
    if (!this.appID || !this.currentRoleID) {
      type === SCOPE.ALL ? this.allScopes = [] : this.someScope = [];
      return;
    }
    return fetchRolePerson(this.appID, this.currentRoleID, { type })
      .then(({ list, total }) => {
        if (type === SCOPE.ALL) {
          this.allScopes = list;
        } else {
          this.someScope = list;
          this.total = total;
        }
      });
  };

  @action
  fetchScopeDetailList = (): void => {
    this.isLoadingDetail = true;
    if (!this.someScope.length) {
      this.scopeDetailList = [];
      this.isLoadingDetail = false;
      return;
    }
    const usersIDList = Array.from(this.someScope, ({ id }) => id);
    const query = getScopeQuery(this.scopeType, usersIDList);
    if (this.scopeType === SCOPE.STAFF) {
      getUserDetail<{ users: UserDetail[] }>({ query }).then((res) => {
        this.scopeDetailList = res?.users;
      }).catch((err) => {
        toast.error(err);
      }).finally(() => {
        this.isLoadingDetail = false;
      });
      return;
    }
    getDepDetail<{ departments: DepDetail[] }>({ query }).then((res) => {
      this.scopeDetailList = res?.departments;
    }).catch((err) => {
      toast.error(err);
    }).finally(() => {
      this.isLoadingDetail = false;
    });
  };

  @action
  deletePerGroupUser = (ids: string[]): void => {
    this.someScope = this.someScope.filter((scope) => !ids.includes(scope.id));
    this.deptScopes = this.deptScopes.filter((scope) => !ids.includes(scope.id));
    this.total = this.someScope.length;
    this.updatePerUser({ add: [], removes: ids });
  };

  @action
  batchUpdatePerUser = (
    deptList: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[],
  ): Promise<void> => {
    const { newScopes, addAndRemoveScope } = getAddAndRemovePerson(this.allScopes, deptList, employees);
    this.someScope = newScopes.filter((scope) => scope.type === this.scopeType);
    this.total = newScopes.length;
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
  clear = (): void => {
    this.appID = '';
    this.allScopes = [];
    this.currentRoleID = '';
    this.scopeType = SCOPE.STAFF;
    this.scopeDetailList = [];
  };
}

export default new RoleAssociateStore();
