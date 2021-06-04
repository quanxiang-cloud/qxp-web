import { observable, action } from 'mobx';

import DepartmentTreeStore from './store';

class OwnerStore {
  @observable
  departmentTreeStore: DepartmentTreeStore

  @observable
  owners: EmployeeOrDepartmentOfRole[];

  constructor(department: Department, members: EmployeeOrDepartmentOfRole[]) {
    this.departmentTreeStore = new DepartmentTreeStore(department);
    this.owners = members;
  }

  @action
  removeOwner = (ownerId: string) => {
    this.owners = this.owners.filter((owner) => owner.ownerID !== ownerId);
  }

  @action
  addOwners = (os: EmployeeOrDepartmentOfRole[]) => {
    this.owners = [
      ...this.owners,
      ...os.filter((o) => !this.owners.find((owner) => owner.ownerID === o.ownerID)),
    ];
  }

  @action
  removeOwners = (ownerIds: string[]) => {
    this.owners = this.owners.filter((owner) => !ownerIds.includes(owner.ownerID));
  }

  @action
  onClear = () => {
    this.owners = [];
  }

  @action
  onRemove = (o: EmployeeOrDepartmentOfRole) => {
    this.owners = this.owners.filter((owner) => owner.ownerID !== o.ownerID);
  }
}

export default OwnerStore;
