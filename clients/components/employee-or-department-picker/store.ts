import { observable, action } from 'mobx';

import TreeStore from '@c/headless-tree/store';

import EmployeeStore from './employee-table/store';
import DepartmentTreeStore from './department-select-tree/store';
import EmployeeTreeStore from './employee-select-tree/store';
import GroupStore from './group-select/store';

class OwnerStore {
  @observable
  employeeTreeStore: TreeStore<Department>;

  @observable
  departmentTreeStore: DepartmentTreeStore;

  @observable
  employeeStore: EmployeeStore;

  @observable
  groupStore: GroupStore;

  @observable
  owners: EmployeeOrDepartmentOfRole[];

  @observable
  tabKey = '1';

  @observable
  usernameKeyword = '';

  @observable
  isIncludeSubDep = true;

  @observable
  leader = {
    id: '',
    name: '',
  };

  @observable
  departmentKeyword = '';

  constructor(department: Department, members: EmployeeOrDepartmentOfRole[]) {
    this.employeeTreeStore = new EmployeeTreeStore(department);
    this.employeeStore = new EmployeeStore();
    this.departmentTreeStore = new DepartmentTreeStore(department);
    this.groupStore = new GroupStore();
    this.owners = members;
  }

  @action
  setTabKey = (key: string) => {
    this.tabKey = key;
  };

  @action
  setUsernameKeyword = (keyword: string) => {
    this.usernameKeyword = keyword;
  };

  @action
  setLeader = (id: string, name: string) => {
    this.leader = {
      id,
      name,
    };
  };

  @action
  setDepartmentKeyword = (keyword: string) => {
    this.departmentKeyword = keyword;
  };

  @action
  onClear = () => {
    this.owners = [];
  };

  @action
  onRemove = (o: EmployeeOrDepartmentOfRole) => {
    this.owners = this.owners.filter((owner) => owner.ownerID !== o.ownerID);
  };

  @action
  addOwner = (o: EmployeeOrDepartmentOfRole) => {
    if (this.owners.find((owner) => owner.ownerID === o.ownerID)) {
      return;
    }
    this.owners = [...this.owners, o];
  };

  @action
  removeOwner = (ownerId: string) => {
    this.owners = this.owners.filter((owner) => owner.ownerID !== ownerId);
  };

  @action
  addOwners = (os: EmployeeOrDepartmentOfRole[]) => {
    this.owners = [
      ...this.owners,
      ...os.filter((o) => !this.owners.find((owner) => owner.ownerID === o.ownerID)),
    ];
  };

  @action
  removeOwners = (ownerIds: string[]) => {
    this.owners = this.owners.filter((owner) => !ownerIds.includes(owner.ownerID));
  };
}

export default OwnerStore;
