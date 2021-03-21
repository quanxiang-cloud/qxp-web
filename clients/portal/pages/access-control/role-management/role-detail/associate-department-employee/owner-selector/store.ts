import { observable, action } from 'mobx';

import TreeStore from '@portal/components/headless-tree/store';
import SelectableTreeStore from '@portal/components/headless-tree/multiple-select-tree';
import EmployeeStore from './employee-table/store';
import { IOwner } from '../../../api';

class OwnerStore {
  @observable
  employeeTreeStore: TreeStore<IDepartment>

  @observable
  departmentTreeStore: SelectableTreeStore<IDepartment>

  @observable
  employeeStore: EmployeeStore;

  @observable
  owners: IOwner[];

  @observable
  tabKey = '1';

  @observable
  usernameKeyword = '';

  @observable
  departmentKeyword = '';

  constructor(
    employeeTreeStore: TreeStore<IDepartment>,
    employeeStore: EmployeeStore,
    departmentTreeStore: SelectableTreeStore<IDepartment>,
    owners: IOwner[]
  ) {
    this.employeeTreeStore = employeeTreeStore;
    this.employeeStore = employeeStore;
    this.departmentTreeStore = departmentTreeStore;
    this.owners = owners;
  }

  @action
  setTabKey = (key: string) => {
    this.tabKey = key;
  }

  @action
  setUsernameKeyword = (keyword: string) => {
    this.usernameKeyword = keyword;
  }

  @action
  setDepartmentKeyword = (keyword: string) => {
    this.departmentKeyword = keyword;
  }

  @action
  onClear = () => {
    this.owners = [];
  }

  @action
  onRemove = (o: IOwner) => {
    this.owners = this.owners.filter((owner) => owner.ownerID !== o.ownerID);
  }
}

export default OwnerStore;
