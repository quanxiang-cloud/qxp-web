import { observable, action } from 'mobx';

import { IOwner, IUser } from '@portal/api/role-management';

class EmployeeStore {
  @observable
  selectedKeys: string[]

  @observable
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  }

  constructor() {
    this.selectedKeys = [];
    this.pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    };
  }

  @action
  setSelectedKeys = (keys: string[]) => {
    this.selectedKeys = keys;
  }

  @action
  setPageSize = (size: number) => {
    this.pagination = { ...this.pagination, pageSize: size };
  }

  @action
  setCurrentPage = (page: number) => {
    this.pagination = { ...this.pagination, current: page };
  }

  @action
  toggleSelectedKeys = (id: string) => {
    this.selectedKeys = this.selectedKeys.includes(id) ?
      this.selectedKeys.filter((item) => item !== id) :
      [...this.selectedKeys, id];
  }

  @action
  setTotal = (total: number) => {
    this.pagination = { ...this.pagination, total };
  }

  @action
  initialSelectedKeys = (users: IUser[], owners: IOwner[]) => {
    this.setSelectedKeys(
      owners.filter((owner) =>
        users?.find((user) => user.id === owner.ownerID)
      ).map(({ ownerID }) => ownerID)
    );
  }
}

export default EmployeeStore;
