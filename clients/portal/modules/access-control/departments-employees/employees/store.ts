import { observable, computed, action } from 'mobx';

import { EmployeesList, UserInfo } from '../type';
import { ModalType } from '../modal';
import { initUserInfo } from '../constant';

class UserStore {
  @observable modalType: ModalType;
  @observable department?: Department;
  @observable employeesList?: EmployeesList;
  @observable loading?: boolean;
  @observable departmentID?: string;
  @observable filterUserInfo?: UserInfo;
  @observable page: number;
  @observable pageSize: number;

  @observable selectedUsers: Employee[];
  @observable currentUser: Employee;
  @observable isIncludeSubEmployees: boolean;

  constructor() {
    this.modalType = '';
    this.page = 1;
    this.pageSize = 10;
    this.selectedUsers = [];
    this.currentUser = initUserInfo;
    this.isIncludeSubEmployees = true;
  }

  closeModal(): void {
    this.setModalType('');
  }

  @computed get selectedUserIds(): string[] {
    return this.selectedUsers.map(({ id }) => id);
  }

  @action
  changeSelect(selectedRows: Employee[]): void {
    this.selectedUsers = selectedRows;
  }

  @action
  changePage(current: number, pageSize: number): void {
    this.page = current;
    this.pageSize = pageSize;
  }

  @action
  setEmployeesList(employeesList?: EmployeesList): void {
    this.employeesList = employeesList;
  }

  @action
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @action
  setFilterUserInfo(filterUserInfo?: UserInfo): void {
    this.filterUserInfo = filterUserInfo;
  }

  @action
  setModalType(modalType: ModalType): void {
    this.modalType = modalType;
  }

  @action
  setCurrentUser(user: Employee): void {
    this.currentUser = user;
  }

  @action
  setIsIncludeSubEmployees(isIncludeSubEmployees: boolean): void {
    this.isIncludeSubEmployees = isIncludeSubEmployees;
  }
}

export default new UserStore();
