import { observable, action } from 'mobx';

export type GroupType = {
  id: string;
  name: string;
};

class GroupStore {
  @observable
  selectedKeys: string[];

  constructor() {
    this.selectedKeys = [];
  }

  @action
  setSelectedKeys = (keys: string[]) => {
    this.selectedKeys = keys;
  };

  @action
  toggleSelectedKeys = (id: string) => {
    this.selectedKeys = this.selectedKeys.includes(id) ?
      this.selectedKeys.filter((item) => item !== id) :
      [...this.selectedKeys, id];
  };

  @action
  initialSelectedKeys = (groups: GroupType[], owners: EmployeeOrDepartmentOfRole[]) => {
    this.setSelectedKeys(
      owners.filter((owner) =>
        groups?.find((group) => group.id === owner.ownerID),
      ).map(({ ownerID }) => ownerID),
    );
  };
}

export default GroupStore;
