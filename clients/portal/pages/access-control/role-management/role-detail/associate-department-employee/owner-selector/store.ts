import { observable, action } from 'mobx';

import TreeStore from '@c/headless-tree/store';
import EmployeeStore from './employee-table/store';
import { IOwner } from '../../../api';
import DepartmentTreeStore from './department-select-tree/store';

class OwnerStore {
  @observable
  employeeTreeStore: TreeStore<IDepartment>

  @observable
  departmentTreeStore: DepartmentTreeStore

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
    departmentTreeStore: DepartmentTreeStore,
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

  @action
  addOwner = (o: IOwner) => {
    if (this.owners.find((owner) => owner.ownerID === o.ownerID)) {
      return;
    }
    this.owners = [...this.owners, o];
  }

  @action
  removeOwner = (ownerId: string) => {
    this.owners = this.owners.filter((owner) => owner.ownerID !== ownerId);
  }

  @action
  addOwners = (os: IOwner[]) => {
    this.owners = [
      ...this.owners,
      ...os.filter((o) => !this.owners.find((owner) => owner.ownerID === o.ownerID)),
    ];
  }

  @action
  removeOwners = (ownerIds: string[]) => {
    this.owners = this.owners.filter((owner) => !ownerIds.includes(owner.ownerID));
  }
}

export default OwnerStore;
