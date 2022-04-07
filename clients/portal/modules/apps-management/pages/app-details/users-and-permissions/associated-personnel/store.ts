import toast from '@lib/toast';
import { action, observable } from 'mobx';
import { fetchRolePerson, getUserDetail, updatePerUser } from '../api';
import { SCOPE } from '../constants';
import { getAddAndRemovePerson } from '../utils';

class RoleAssociateStore {
  @observable scopeType = SCOPE.STAFF;
  @observable appID = '';
  @observable currentScopes: DeptAndUser[] = [];
  @observable currentRoleID = '';
  @observable isLoadingScope = false;
  @observable selectUser: string[] = [];
  @observable UserDetailList: [] = [];
  @observable showPickerModal = false;
  @observable scopeDeptList: UserOrDept[] = [];

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
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setCurrentScopes = (currentScopes: DeptAndUser[]): void => {
    this.currentScopes = currentScopes;
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
  fetchRolePerson = (appID: string, roleID: string): void => {
    this.setAppID(appID);
    this.setCurrentRoleID(roleID);
    fetchRolePerson(appID, roleID)
      .then((res) => {
        this.setCurrentScopes(res.list);
      })
      .catch((err) => toast.error(err));
  };

  @action
  deletePerGroupUser = (ids: string[]): void => {
    const newScopes = this.currentScopes?.filter((scope) => !ids.includes(scope.id));
    this.setCurrentScopes(newScopes);
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
    return updatePerUser(this.appID, this.currentRoleID, addAndRemoveList);
  };
}

export default new RoleAssociateStore();
